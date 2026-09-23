/* =========================================================
   云同步模块：用 GitHub Gist 在手机和电脑之间同步学习进度
   - 纯网页实现，不需要服务器、不需要安装 App
   - 令牌与云端地址只保存在本机浏览器，不会上传到别处
   - 合并规则：勾选并集 / 笔记取更完整 / 日志去重 / 番茄取最大
   ========================================================= */
(function () {
  "use strict";

  var CFG_KEY = "agentHub.sync.v1";
  var FILE_NAME = "agent-learning-progress.json";
  var AUTO_DEBOUNCE = 6000;

  var cfg = readCfg();
  var autoTimer = null;
  var applying = false;
  var busy = false;

  function readCfg() {
    try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch (e) { return {}; }
  }
  function writeCfg() {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  }
  function hub() { return window.__agentHub || null; }
  function toast(msg) { var h = hub(); if (h && h.toast) h.toast(msg); }
  function $(sel) { return document.querySelector(sel); }

  function nowText(ts) {
    var d = new Date(ts || Date.now());
    function p(n) { return String(n).padStart(2, "0"); }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- GitHub API ---------------- */
  function api(path, opts) {
    opts = opts || {};
    var headers = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
    if (cfg.token) headers["Authorization"] = "Bearer " + cfg.token;
    if (opts.body) headers["Content-Type"] = "application/json";
    return fetch("https://api.github.com" + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) {}
        if (!res.ok) {
          var msg = (data && data.message) || ("HTTP " + res.status);
          if (res.status === 401) msg = "令牌无效或已过期，请重新生成";
          if (res.status === 403) msg = "令牌没有 gist 权限，请重新生成并勾选 gist";
          if (res.status === 404) msg = "找不到云端备份（可能已被删除），请重新连接创建";
          throw new Error(msg);
        }
        return data;
      });
    });
  }

  function gistBody(content, isNew) {
    var body = { files: {} };
    body.files[FILE_NAME] = { content: content };
    if (isNew) {
      body.description = "Agent 学习平台进度（自动同步用，请勿删除）";
      body.public = false;
    }
    return body;
  }

  function readContentFromGist(data) {
    if (!data || !data.files) return null;
    var file = data.files[FILE_NAME];
    if (!file) {
      var keys = Object.keys(data.files);
      if (!keys.length) return null;
      file = data.files[keys[0]];
    }
    return file && typeof file.content === "string" ? file.content : null;
  }

  /* ---------------- 合并逻辑 ---------------- */
  function mergeState(local, remote) {
    local = local || {};
    remote = remote || {};
    var out = JSON.parse(JSON.stringify(local));
    var addedTasks = 0;

    ["tasks", "practices", "mastered"].forEach(function (key) {
      var L = local[key] || {};
      var R = remote[key] || {};
      var merged = {};
      Object.keys(L).forEach(function (k) { merged[k] = !!L[k]; });
      Object.keys(R).forEach(function (k) {
        if (R[k] && !merged[k] && key === "tasks") addedTasks++;
        merged[k] = !!R[k] || !!merged[k];
      });
      out[key] = merged;
    });

    var noteKeys = {};
    Object.keys(remote.notes || {}).forEach(function (k) { noteKeys[k] = 1; });
    Object.keys(local.notes || {}).forEach(function (k) { noteKeys[k] = 1; });
    var notes = {};
    Object.keys(noteKeys).forEach(function (k) {
      var a = (local.notes || {})[k] || "";
      var b = (remote.notes || {})[k] || "";
      notes[k] = a.length >= b.length ? a : b;
    });
    out.notes = notes;

    var seen = {};
    var logs = [];
    (local.logs || []).concat(remote.logs || []).forEach(function (item) {
      if (!item) return;
      var key = String(item.date || "") + "|" + String(item.text || "");
      if (seen[key]) return;
      seen[key] = 1;
      logs.push(item);
    });
    logs.sort(function (x, y) { return String(x.date || "").localeCompare(String(y.date || "")); });
    out.logs = logs;

    out.pomodoro = Math.max(local.pomodoro || 0, remote.pomodoro || 0);
    out.updatedAt = Date.now();

    return {
      merged: out,
      stats: "任务并集 +" + addedTasks + " 项、日志共 " + logs.length + " 条"
    };
  }

  /* ---------------- 同步动作 ---------------- */
  function uploadState(quiet) {
    var h = hub();
    if (!h) return Promise.reject(new Error("页面还没准备好"));
    if (!cfg.token) return Promise.reject(new Error("请先填入 GitHub 令牌"));
    if (busy) return Promise.resolve(null);
    busy = true;

    var content = JSON.stringify(h.getState());
    var req = cfg.gistId
      ? api("/gists/" + cfg.gistId, { method: "PATCH", body: gistBody(content, false) })
      : api("/gists", { method: "POST", body: gistBody(content, true) });

    return req.then(function (data) {
      cfg.gistId = data.id;
      cfg.lastSync = Date.now();
      cfg.lastDir = "上传";
      cfg.lastResult = "已上传本机进度";
      writeCfg();
    }).then(function () {
      busy = false;
      renderSyncView();
      renderSyncNavCount();
      if (!quiet) toast("已上传到云端");
    }, function (err) {
      busy = false;
      renderSyncView(err.message);
      if (!quiet) toast("上传失败：" + err.message);
      throw err;
    });
  }

  function downloadState(quiet) {
    var h = hub();
    if (!h) return Promise.reject(new Error("页面还没准备好"));
    if (!cfg.token) return Promise.reject(new Error("请先填入 GitHub 令牌"));
    if (!cfg.gistId) return Promise.reject(new Error("还没有云端备份，请点「立即同步」创建"));
    if (busy) return Promise.resolve(null);
    busy = true;

    return api("/gists/" + cfg.gistId).then(function (data) {
      var text = readContentFromGist(data);
      if (!text) throw new Error("云端备份内容为空");
      var remote;
      try { remote = JSON.parse(text); } catch (e) { throw new Error("云端内容解析失败"); }
      var result = mergeState(h.getState(), remote);
      applying = true;
      h.replaceState(result.merged);
      applying = false;
      cfg.lastSync = Date.now();
      cfg.lastDir = "合并";
      cfg.lastResult = "已合并（" + result.stats + "）";
      writeCfg();
      return uploadState(true).then(function () {
        busy = false;
        renderSyncView();
        renderSyncNavCount();
        if (!quiet) toast("同步完成，两端进度已合并");
      });
    }, function (err) {
      busy = false;
      renderSyncView(err.message);
      if (!quiet) toast("同步失败：" + err.message);
      throw err;
    });
  }

  function scheduleAutoPush() {
    if (applying || !cfg.auto || !cfg.token || !cfg.gistId) return;
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function () {
      uploadState(true).catch(function () {});
    }, AUTO_DEBOUNCE);
  }

  function renderSyncNavCount() {
    var el = document.getElementById("syncNavCount");
    if (!el) return;
    el.textContent = cfg.token ? (cfg.auto ? "自动" : "手动") : "";
  }

  /* ---------------- 同步页面 ---------------- */
  function connectAndSync() {
    var input = $("#syncToken");
    var token = input ? String(input.value || "").trim() : "";
    if (!token) { toast("请先粘贴 GitHub 令牌"); return; }
    cfg.token = token;
    if (cfg.auto === undefined) cfg.auto = true;
    writeCfg();
    renderSyncView("正在连接 GitHub…");

    api("/gists?per_page=100").then(function (list) {
      var found = null;
      (list || []).forEach(function (g) {
        if (g && g.files && g.files[FILE_NAME]) found = g.id;
      });
      if (found) {
        cfg.gistId = found;
        writeCfg();
        return downloadState(false);
      }
      cfg.gistId = null;
      writeCfg();
      return uploadState(false);
    }).catch(function (err) {
      renderSyncView(err.message);
      toast("连接失败：" + err.message);
    });
  }

  function renderSyncView(errorMsg) {
    var el = $("#view-sync");
    if (!el) return;
    var h = hub();
    var localState = h ? h.getState() : {};
    var taskCount = Object.keys(localState.tasks || {}).filter(function (k) { return localState.tasks[k]; }).length;

    var html = "";
    html += '<div class="page-head">' +
      '<div class="page-kicker">手机 + 电脑，进度互通</div>' +
      '<h1 class="page-title">云同步进度</h1>' +
      '<p class="page-goal">用你已有的 GitHub 账号做云端备份，不需要服务器、不用装 App。' +
      '电脑上勾的任务、手机上写的日志，都能合并到一起，谁都不会覆盖谁。</p></div>';

    if (errorMsg) {
      html += '<div class="card tight sync-error"><b>同步失败</b><br>' + esc(errorMsg) +
        '<div style="margin-top:8px;color:var(--text-faint);font-size:12.5px">' +
        '常见原因：令牌没勾 gist 权限、网络被墙（需要开启代理）、或云端备份被删除。' +
        '本地进度不受影响，修好后重新点一次同步即可。</div></div>';
    }

    html += '<div class="card"><div class="section-head">' +
      '<span class="section-title">当前状态</span><span class="spacer"></span>' +
      '<span class="badge ' + (cfg.token ? "green" : "") + '">' + (cfg.token ? "已连接" : "未连接") + '</span>' +
      (cfg.token ? '<span class="badge ' + (cfg.auto ? "accent" : "") + '">' + (cfg.auto ? "自动同步" : "手动同步") + '</span>' : '') +
      '</div>';
    html += '<div class="res-list">' +
      '<div class="res"><span class="res-name">本机已完成项</span><span class="res-note" style="text-align:right">' + taskCount + ' 项勾选</span></div>' +
      '<div class="res"><span class="res-name">上次同步</span><span class="res-note" style="text-align:right">' +
        (cfg.lastSync ? esc(nowText(cfg.lastSync)) + " · " + esc(cfg.lastDir || "") + " · " + esc(cfg.lastResult || "") : "还没有同步过") + '</span></div>' +
      '<div class="res"><span class="res-name">云端备份</span><span class="res-note" style="text-align:right">' +
        (cfg.gistId
          ? '<a href="https://gist.github.com/' + esc(cfg.gistId) + '" target="_blank" rel="noopener">在 GitHub 查看这份私有 Gist ↗</a>'
          : "未创建") + '</span></div>' +
      '</div></div>';

    if (!cfg.token) {
      html += '<div class="card"><div class="section-head"><span class="section-title">第一次使用：3 步配置</span>' +
        '<span class="section-sub">电脑和手机各配置一次即可（令牌不需要一样，同一个账号就行）</span></div>';

      html += '<div class="sync-step"><span class="step-no">1</span><div style="flex:1">' +
        '<b>生成一个 GitHub 令牌</b><br>' +
        '<span style="color:var(--text-dim);font-size:13.5px">点下面的按钮打开 GitHub，页面已经帮你勾好 <code>gist</code> 权限。' +
        '拉到最下面点 <b>Generate token</b>，复制那串以 <code>ghp_</code> 开头的字符（只显示一次）。</span><br>' +
        '<a class="btn small primary" style="margin-top:8px" target="_blank" rel="noopener" ' +
        'href="https://github.com/settings/tokens/new?scopes=gist&description=Agent%20%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%BF%9B%E5%BA%A6%E5%90%8C%E6%AD%A5">' +
        '打开 GitHub 创建令牌 ↗</a></div></div>';

      html += '<div class="sync-step"><span class="step-no">2</span><div style="flex:1">' +
        '<b>把令牌粘贴到这里并连接</b><br>' +
        '<input type="password" id="syncToken" class="sync-input" placeholder="ghp_..." autocomplete="off">' +
        '<div class="practice-actions"><button class="btn primary small" data-sync="connect">保存并连接</button>' +
        '<span style="color:var(--text-faint);font-size:12.5px">令牌只保存在本机浏览器，可随时在 GitHub 撤销</span></div>' +
        '</div></div>';

      html += '<div class="sync-step"><span class="step-no">3</span><div style="flex:1">' +
        '<b>在手机上做同样的事</b><br>' +
        '<span style="color:var(--text-dim);font-size:13.5px">手机浏览器打开同一个网址 → 进入本页面 → 粘贴同一个账号的令牌 → 点「保存并连接」。' +
        '手机会自动找到云端备份并合并进度。</span></div></div>';

      html += '</div>';
    } else {
      html += '<div class="card"><div class="section-head"><span class="section-title">同步操作</span></div>' +
        '<div class="practice-actions" style="flex-wrap:wrap">' +
        '<button class="btn primary" data-sync="sync">立即同步（合并两端）</button>' +
        '<button class="btn" data-sync="push">仅上传本机</button>' +
        '<button class="btn" data-sync="pull">仅下载合并</button>' +
        '<button class="btn" data-sync="auto">' + (cfg.auto ? "关闭自动同步" : "开启自动同步") + '</button>' +
        '<button class="btn ghost" data-sync="disconnect">断开云端</button>' +
        '<button class="btn danger" data-sync="forget">删除令牌</button>' +
        '</div>' +
        '<div style="margin-top:10px;color:var(--text-faint);font-size:13px">' +
        '自动同步开启后：本机每完成一次操作，6 秒后自动上传；打开页面时会自动拉取并合并一次。' +
        '</div></div>';
    }

    html += '<div class="card"><div class="section-head"><span class="section-title">合并规则（不会丢进度）</span></div>' +
      '<ul class="check-list">' +
      '<li>任务、练习、面试题的勾选状态：取并集。手机勾过的，电脑上也会有。</li>' +
      '<li>练习笔记与步骤笔记：同一处都有内容时，保留更完整（字数更多）的那份。</li>' +
      '<li>学习日志：按「日期 + 内容」去重后合并，两边都保留。</li>' +
      '<li>番茄钟数量：取两边较大的值。</li>' +
      '</ul>' +
      '<div style="color:var(--text-faint);font-size:13px">同步完成时会把合并后的结果再写回云端，所以两边最终会完全一致。</div>' +
      '</div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">安全提示</span></div>' +
      '<ul class="check-list">' +
      '<li>令牌只写进你本机浏览器的 localStorage，不会发给除 GitHub 以外的任何服务器。</li>' +
      '<li>云端备份是私有 Gist，只有你自己的账号能看到。</li>' +
      '<li>不要在网吧或别人的电脑上粘贴令牌；怀疑泄露就去 GitHub 撤销并重新生成。</li>' +
      '<li>清理浏览器数据会同时清掉令牌和本地进度，重要节点建议用顶栏 ↓ 再导出一份。</li>' +
      '</ul></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">不想用云同步？还有备用方案</span></div>' +
      '<ul class="check-list">' +
      '<li>电脑上点顶栏 ↓ 导出 JSON，用微信发给自己，手机上打开页面点 ↑ 导入。</li>' +
      '<li>反过来也一样：手机上导出，电脑上导入。适合偶尔同步一次。</li>' +
      '</ul></div>';

    el.innerHTML = html;
  }

  /* ---------------- 交互 ---------------- */
  function bind() {
    document.addEventListener("click", function (e) {
      var target = e.target;
      if (!target || !target.closest) return;
      var el = target.closest("[data-sync]");
      if (!el) return;
      var act = el.getAttribute("data-sync");

      if (act === "connect") { connectAndSync(); return; }

      if (act === "sync") { downloadState(false).catch(function () {}); return; }
      if (act === "push") { uploadState(false).catch(function () {}); return; }
      if (act === "pull") { downloadState(false).catch(function () {}); return; }

      if (act === "auto") {
        cfg.auto = !cfg.auto;
        writeCfg();
        renderSyncView();
        renderSyncNavCount();
        toast(cfg.auto ? "已开启自动同步" : "已关闭自动同步");
        if (cfg.auto) scheduleAutoPush();
        return;
      }
      if (act === "disconnect") {
        cfg.gistId = null;
        writeCfg();
        renderSyncView();
        renderSyncNavCount();
        toast("已断开云端，本地进度保持不变");
        return;
      }
      if (act === "forget") {
        if (!confirm("确定删除本机保存的令牌吗？本地学习进度不会受影响。")) return;
        cfg = {};
        writeCfg();
        renderSyncView();
        renderSyncNavCount();
        toast("已删除本机令牌");
        return;
      }
    });

    var h = hub();
    if (h && h.onSave) h.onSave(scheduleAutoPush);

    setTimeout(function () {
      if (cfg.auto && cfg.token && cfg.gistId) {
        downloadState(true).catch(function () {});
      }
    }, 1800);

    renderSyncNavCount();
  }

  window.renderSyncView = renderSyncView;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
