/* =========================================================
   Agent 学习平台 · 应用逻辑
   数据全部保存在浏览器 localStorage，刷新不丢，可导出备份。
   ========================================================= */
(function () {
  "use strict";

  var STORE_KEY = "agentHub.v1";
  var THEME_KEY = "agentHub.theme";
  var storageOk = true;

  /* ---------------- 状态 ---------------- */
  function defaultState() {
    return {
      tasks: {},      // 勾选项：阶段任务、作品清单、自测清单
      practices: {},  // 练习完成标记
      notes: {},      // 练习笔记
      mastered: {},   // 面试题掌握标记
      logs: [],       // 学习日志
      pomodoro: 0,    // 完成的番茄数
      updatedAt: Date.now()
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var base = defaultState();
      Object.keys(base).forEach(function (k) {
        if (parsed[k] !== undefined) base[k] = parsed[k];
      });
      return base;
    } catch (e) {
      console.warn("读取本地进度失败，已使用空进度", e); storageOk = false;
      return defaultState();
    }
  }

  var state = loadState();
  var saveHooks = [];

  function saveState() {
    state.updatedAt = Date.now();
    for (var __h = 0; __h < saveHooks.length; __h++) { try { saveHooks[__h](); } catch (e) {} }
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("保存失败", e); storageOk = false;
    }
  }

  /* ---------------- 小工具 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function pct(done, total) {
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  function stageTaskId(stageId, i) { return stageId + ".t" + i; }
  function stagePracticeId(stageId, i) { return stageId + ".p" + i; }

  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 1900);
  }

  function todayStr() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  /* ---------------- 进度计算 ---------------- */
  function stageStats(stage) {
    var tTotal = stage.tasks.length;
    var tDone = 0;
    for (var i = 0; i < tTotal; i++) if (state.tasks[stageTaskId(stage.id, i)]) tDone++;
    var pTotal = stage.practices.length;
    var pDone = 0;
    for (var j = 0; j < pTotal; j++) if (state.practices[stagePracticeId(stage.id, j)]) pDone++;
    return {
      tTotal: tTotal, tDone: tDone, pTotal: pTotal, pDone: pDone,
      total: tTotal + pTotal,
      done: tDone + pDone,
      percent: pct(tDone + pDone, tTotal + pTotal)
    };
  }

  function globalStats() {
    var tTotal = 0, tDone = 0, pTotal = 0, pDone = 0;
    ROADMAP.stages.forEach(function (s) {
      var st = stageStats(s);
      tTotal += st.tTotal; tDone += st.tDone;
      pTotal += st.pTotal; pDone += st.pDone;
    });
    var projTotal = 0, projDone = 0;
    PROJECTS.forEach(function (p) {
      var items = p.features.concat(p.deliverables);
      items.forEach(function (_, i) {
        projTotal++;
        if (state.tasks[p.id + ".item" + i]) projDone++;
      });
    });
    var selfTotal = SELFCHECK.length, selfDone = 0;
    SELFCHECK.forEach(function (_, i) { if (state.tasks["self." + i]) selfDone++; });

    var total = tTotal + pTotal + projTotal + selfTotal;
    var done = tDone + pDone + projDone + selfDone;
    return {
      tTotal: tTotal, tDone: tDone,
      pTotal: pTotal, pDone: pDone,
      projTotal: projTotal, projDone: projDone,
      selfTotal: selfTotal, selfDone: selfDone,
      total: total, done: done, percent: pct(done, total)
    };
  }

  function totalMinutes() {
    return state.logs.reduce(function (sum, l) { return sum + (Number(l.minutes) || 0); }, 0);
  }

  /* ---------------- 顶栏与侧边栏 ---------------- */
  function renderBrand() {
    $("#brandTitle").textContent = ROADMAP.siteTitle;
    $("#brandSub").textContent = ROADMAP.subtitle;
    document.title = ROADMAP.siteTitle + " · " + ROADMAP.subtitle;
  }

  function renderGlobalProgress() {
    var g = globalStats();
    $("#globalBar").querySelector("i").style.width = g.percent + "%";
    $("#globalBar").classList.toggle("done", g.percent >= 100);
    $("#globalPct").textContent = g.percent + "%";
    return g;
  }

  function renderNav() {
    var nav = $("#stageNav");
    var html = "";
    ROADMAP.stages.forEach(function (s) {
      var st = stageStats(s);
      var complete = st.percent === 100;
      html += '<button class="nav-item' + (complete ? " complete" : "") + '" data-view="stage" data-arg="' + s.id + '">' +
        '<span class="nav-no">' + esc(s.no.replace("阶段 ", "S")) + '</span>' +
        '<span class="nav-label">' + esc(s.title) + '</span>' +
        '<span class="nav-count">' + st.done + "/" + st.total + '</span>' +
        '</button>' +
        '<div class="bar mini-bar"><i style="width:' + st.percent + '%"></i></div>';
    });
    nav.innerHTML = html;

    var g = globalStats();
    $("#projNavCount").textContent = g.projDone + "/" + g.projTotal;
    var mastered = Object.keys(state.mastered).filter(function (k) { return state.mastered[k]; }).length;
    $("#intNavCount").textContent = mastered + "/" + INTERVIEW.length;
    $("#logNavCount").textContent = state.logs.length ? state.logs.length + " 条" : "";
    $("#tutNavCount").textContent = tutorialDoneCount() + "/" + tutorialTotalCount();
  }

  function markNavActive(view, arg) {
    $$(".nav-item").forEach(function (b) {
      var match = b.getAttribute("data-view") === view &&
        (view !== "stage" || b.getAttribute("data-arg") === arg);
      b.classList.toggle("active", match);
    });
  }

  /* ---------------- 路由 ---------------- */
  function navigate(view, arg) {
    if (!view) view = "dashboard";
    var target = $("#view-" + view);
    if (!target) { view = "dashboard"; target = $("#view-dashboard"); }

    $$(".view").forEach(function (v) { v.classList.remove("active"); });
    target.classList.add("active");

    if (view === "tutorials") renderTutorialView(view, arg);
    else if (view === "sync") { if (typeof renderSyncView === "function") renderSyncView(); else $("#view-sync").innerHTML = "<div class=\"empty\">同步模块加载中…</div>"; }
    else if (view === "dashboard") renderDashboard();
    else if (view === "stage") renderStage(arg);
    else if (view === "projects") renderProjects();
    else if (view === "interview") renderInterview();
    else if (view === "log") renderLog();
    else if (view === "search") renderSearch();

    markNavActive(view, arg);
    $("#main").scrollTop = 0;
    window.scrollTo(0, 0);

    var hash = "#" + view + (arg ? "/" + arg : "");
    if (location.hash !== hash) {
      history.replaceState(null, "", hash);
    }
    if (window.innerWidth <= 860) $("#sidebar").classList.remove("open");
  }

  function navigateFromHash() {
    var raw = (location.hash || "").replace(/^#/, "");
    if (!raw) return navigate("dashboard");
    var parts = raw.split("/");
    var view = parts[0];
    var arg = parts[1];
    if (view === "interview" || view === "projects") return navigate(view);
    if (view === "tutorials") return navigate("tutorials", arg);
    if (view === "sync") return navigate("sync");
    if (view === "stage" && arg) return navigate("stage", arg);
    if (["dashboard", "log", "search"].indexOf(view) >= 0) return navigate(view);
    navigate("dashboard");
  }

  /* ---------------- 番茄钟 ---------------- */
  var timer = { total: 25 * 60, left: 25 * 60, running: false, handle: null };

  function renderTimer() {
    var m = Math.floor(timer.left / 60);
    var s = timer.left % 60;
    $("#timerDisplay").textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    $("#timer").classList.toggle("running", timer.running);
    $("#timerToggle").textContent = timer.running ? "暂停" : "开始";
  }

  function startTimer() {
    if (timer.running) return;
    timer.running = true;
    renderTimer();
    timer.handle = setInterval(function () {
      timer.left--;
      if (timer.left <= 0) {
        clearInterval(timer.handle);
        timer.running = false;
        timer.left = timer.total;
        state.pomodoro++;
        saveState();
        renderTimer();
        toast("完成一个 25 分钟专注，共 " + state.pomodoro + " 个");
        return;
      }
      renderTimer();
    }, 1000);
  }

  function pauseTimer() {
    timer.running = false;
    clearInterval(timer.handle);
    renderTimer();
  }

  function resetTimer() {
    pauseTimer();
    timer.left = timer.total;
    renderTimer();
  }

  /* ---------------- 主题 ---------------- */
  function applyTheme(mode) {
    document.body.classList.toggle("light", mode === "light");
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
  }

  function initTheme() {
    var saved = "dark";
    try { saved = localStorage.getItem(THEME_KEY) || "dark"; } catch (e) {}
    applyTheme(saved);
  }

  /* ---------------- 总览页 ---------------- */
  function nextSuggestions(limit) {
    var out = [];
    for (var i = 0; i < ROADMAP.stages.length; i++) {
      var s = ROADMAP.stages[i];
      for (var j = 0; j < s.tasks.length; j++) {
        if (!state.tasks[stageTaskId(s.id, j)]) {
          out.push({ stage: s, taskId: stageTaskId(s.id, j), text: s.tasks[j] });
        }
        if (out.length >= limit) return out;
      }
    }
    return out;
  }

  function renderDashboard() {
    var g = globalStats();
    var hours = (totalMinutes() / 60).toFixed(1);
    var sug = nextSuggestions(4);

    var html = "";

    html += '<div class="page-head">' +
      '<div class="page-kicker">' + esc(ROADMAP.subtitle) + '</div>' +
      '<h1 class="page-title">学习总览</h1>' +
      '<p class="page-goal">左边是 10 个阶段（含第 0 周准备）的完整路线。每完成一个任务就点一下勾选，进度会自动保存到本机浏览器。' +
      '建议配合番茄钟使用：每天 2-3 小时，坚持 24 周。</p>' +
      '</div>';

    html += '<div class="grid cols-4" style="margin-bottom:16px">' +
      statCard("总进度", g.percent + "%", g.done + " / " + g.total + " 项") +
      statCard("阶段任务", g.tDone + "/" + g.tTotal, "练习 " + g.pDone + "/" + g.pTotal + " 已完成") +
      statCard("作品清单", g.projDone + "/" + g.projTotal, "3 个作品") +
      statCard("学习时长", hours + "h", state.pomodoro + " 个番茄") +
      '</div>';

    html += '<div class="card">' +
      '<div class="section-head"><span class="section-title">接下来做什么</span>' +
      '<span class="section-sub">按路线顺序自动推荐</span></div>';
    if (!sug.length) {
      html += '<div class="empty">全部任务已完成。接下来请打磨作品集、准备面试。</div>';
    } else {
      html += '<div class="res-list">';
      sug.forEach(function (it) {
        html += '<div class="res" style="cursor:pointer" data-action="goto-stage" data-arg="' + it.stage.id + '">' +
          '<span class="badge accent">' + esc(it.stage.no) + '</span>' +
          '<span class="res-name" style="flex:1;font-weight:400">' + esc(it.text) + '</span>' +
          '<span class="res-arrow">开始 →</span>' +
          '</div>';
      });
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">阶段进度</span>' +
      '<span class="section-sub">点击任意阶段进入学习</span></div><div class="res-list">';
    ROADMAP.stages.forEach(function (s) {
      var st = stageStats(s);
      html += '<div class="res" style="cursor:pointer" data-action="goto-stage" data-arg="' + s.id + '">' +
        '<span class="badge' + (st.percent === 100 ? " green" : "") + '">' + esc(s.no) + '</span>' +
        '<span class="res-name" style="flex:1">' + esc(s.title) + '</span>' +
        '<div class="bar" style="width:150px"><i style="width:' + st.percent + '%"></i></div>' +
        '<span class="res-note" style="flex:0 0 auto;font-family:var(--mono)">' + st.done + "/" + st.total + '</span>' +
        '</div>';
    });
    html += '</div></div>';

    html += '<div class="grid cols-2">';
    html += '<div class="card"><div class="section-head"><span class="section-title">每天怎么做</span></div><ul class="check-list">' +
      ROUTINE.daily.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>';
    html += '<div class="card"><div class="section-head"><span class="section-title">每周怎么做</span></div><ul class="check-list">' +
      ROUTINE.weekly.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>';
    html += '</div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">你的情况需要多久</span></div>' +
      '<div class="res-list">';
    TIMEPLAN.forEach(function (row) {
      html += '<div class="res"><span class="badge accent" style="min-width:150px">' + esc(row[0]) + '</span>' +
        '<span class="res-name" style="min-width:90px">' + esc(row[1]) + '</span>' +
        '<span class="res-note">' + esc(row[2]) + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">阶段自测清单</span>' +
      '<span class="section-sub">全部打勾就达到可投递水平</span></div><div>';
    SELFCHECK.forEach(function (text, i) {
      var id = "self." + i;
      html += '<div class="task' + (state.tasks[id] ? " done" : "") + '" data-action="toggle-task" data-id="' + id + '">' +
        '<span class="box">✓</span><span class="task-text">' + esc(text) + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">八条避坑原则</span></div>' +
      '<ul class="check-list">' + PRINCIPLES.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>';

    $("#view-dashboard").innerHTML = renderPersonalBanner() + html;
  }

  function statCard(label, value, sub) {
    return '<div class="stat"><div class="stat-label">' + esc(label) + '</div>' +
      '<div class="stat-value">' + esc(value) + '</div>' +
      '<div class="stat-label" style="margin-top:2px">' + esc(sub) + '</div></div>';
  }

  /* ---------------- 阶段详情页 ---------------- */
  function renderStage(stageId) {
    var s = ROADMAP.stages.filter(function (x) { return x.id === stageId; })[0] || ROADMAP.stages[0];
    var st = stageStats(s);
    var idx = ROADMAP.stages.indexOf(s);
    var prev = ROADMAP.stages[idx - 1];
    var next = ROADMAP.stages[idx + 1];

    var html = "";

    html += '<div class="page-head">' +
      '<div class="page-kicker">' + esc(s.no) + ' · ' + esc(s.weeks) + ' · 预计 ' + esc(s.duration) + '</div>' +
      '<h1 class="page-title">' + esc(s.title) + '</h1>' +
      '<p class="page-goal">' + esc(s.goal) + '</p>' +
      '</div>';

    html += '<div class="card tight"><div class="progress-line">' +
      '<span style="font-size:12.5px;color:var(--text-dim);flex:0 0 auto">本阶段进度</span>' +
      '<div class="bar"><i style="width:' + st.percent + '%"></i></div>' +
      '<span>' + st.percent + '% · ' + st.done + "/" + st.total + '</span>' +
      '</div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">学习清单</span>' +
      '<span class="section-sub">先知道要学什么，再逐项攻克</span></div><div class="chips">' +
      s.topics.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") +
      '</div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">任务打卡</span>' +
      '<span class="section-sub">完成一项就点一下</span><span class="spacer"></span>' +
      '<span class="badge' + (st.tDone === st.tTotal ? " green" : "") + '">' + st.tDone + " / " + st.tTotal + '</span></div><div>';
    s.tasks.forEach(function (text, i) {
      var id = stageTaskId(s.id, i);
      html += '<div class="task' + (state.tasks[id] ? " done" : "") + '" data-action="toggle-task" data-id="' + id + '">' +
        '<span class="box">✓</span><span class="task-text">' + esc(text) + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">动手练习</span>' +
      '<span class="section-sub">只学不练等于没学，练习才是简历素材</span><span class="spacer"></span>' +
      '<span class="badge' + (st.pDone === st.pTotal ? " green" : "") + '">' + st.pDone + " / " + st.pTotal + '</span></div>';
    s.practices.forEach(function (p, i) {
      var id = stagePracticeId(s.id, i);
      var done = !!state.practices[id];
      html += '<div class="practice' + (openPractices[id] ? " open" : "") + '" data-practice="' + id + '">' +
        '<div class="practice-head" data-action="toggle-practice" data-id="' + id + '">' +
        '<span class="caret">▶</span>' +
        '<span class="practice-title">' + esc(p.title) + '</span>' +
        '<span class="badge' + (done ? " green" : "") + '">' + (done ? "已完成" : "未完成") + '</span>' +
        '</div>' +
        '<div class="practice-body">' +
        '<div class="field"><div class="field-label">要做的事</div><p>' + esc(p.brief) + '</p></div>' +
        '<div class="field"><div class="field-label hint">提示</div><p>' + esc(p.hint) + '</p></div>' +
        '<div class="field"><div class="field-label ok">验收标准</div><p>' + esc(p.criteria) + '</p></div>' +
        '<div class="field"><div class="field-label">我的笔记 / 代码链接</div>' +
        '<textarea class="note" data-note="' + id + '" placeholder="写下你的实现思路、踩过的坑、GitHub 链接…（自动保存）">' +
        esc(state.notes[id] || "") + '</textarea></div>' +
        '<div class="practice-actions">' +
        '<button class="btn primary small" data-action="complete-practice" data-id="' + id + '">' +
        (done ? "取消完成" : "标记为完成") + '</button>' +
        '<span class="saved-tip" data-tip="' + id + '">已保存</span>' +
        '</div></div></div>';
    });
    html += '</div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">本阶段验收标准</span></div>' +
      '<ul class="check-list">' + s.acceptance.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">推荐资源</span>' +
      '<span class="section-sub">先看官方文档，再看教程</span></div><div class="res-list">';
    s.resources.forEach(function (r) {
      var isHash = r.url.indexOf("#") === 0;
      html += '<a class="res" href="' + esc(r.url) + '"' + (isHash ? "" : ' target="_blank" rel="noopener"') + '>' +
        '<span class="res-name">' + esc(r.name) + '</span>' +
        '<span class="res-note">' + esc(r.note || "") + '</span>' +
        '<span class="res-arrow">' + (isHash ? "→" : "↗") + '</span></a>';
    });
    html += '</div></div>';

    html += '<div class="grid cols-2" style="margin-top:22px">';
    html += prev
      ? '<button class="btn" data-action="goto-stage" data-arg="' + prev.id + '">← ' + esc(prev.no) + " " + esc(prev.title) + '</button>'
      : '<span></span>';
    html += next
      ? '<button class="btn" data-action="goto-stage" data-arg="' + next.id + '" style="text-align:right">' + esc(next.no) + " " + esc(next.title) + ' →</button>'
      : '<button class="btn" data-action="goto-view" data-arg="projects" style="text-align:right">进入作品集打磨 →</button>';
    html += '</div>';

    $("#view-stage").innerHTML = personalStageHtml(s.id) + html;
  }

  /* ---------------- 作品集看板 ---------------- */
  function renderProjects() {
    var g = globalStats();
    var html = "";

    html += '<div class="page-head">' +
      '<div class="page-kicker">阶段 8 · 第 21-22 周</div>' +
      '<h1 class="page-title">作品集看板</h1>' +
      '<p class="page-goal">面试官不会看你说会什么，只会看你能做出什么。这 3 个作品做完并上线，你就有了可投递的硬通货。' +
      '每勾选一项都会计入总进度。</p></div>';

    html += '<div class="card tight"><div class="progress-line">' +
      '<span style="font-size:12.5px;color:var(--text-dim);flex:0 0 auto">作品集完成度</span>' +
      '<div class="bar"><i style="width:' + pct(g.projDone, g.projTotal) + '%"></i></div>' +
      '<span>' + g.projDone + "/" + g.projTotal + '</span></div></div>';

    PROJECTS.forEach(function (p) {
      var items = p.features.concat(p.deliverables);
      var done = 0;
      items.forEach(function (_, i) { if (state.tasks[p.id + ".item" + i]) done++; });

      html += '<div class="card">';
      html += '<div class="section-head">' +
        '<span class="badge accent">' + esc(p.rank) + '</span>' +
        '<span class="section-title">' + esc(p.name) + '</span><span class="spacer"></span>' +
        '<span class="badge' + (done === items.length ? " green" : "") + '">' + done + " / " + items.length + '</span>' +
        '</div>';
      html += '<p class="page-goal" style="margin-bottom:10px">' + esc(p.tagline) + '</p>';
      html += '<p style="color:var(--text-faint);font-size:13.5px;margin:0 0 14px">用户故事：' + esc(p.story) + '</p>';

      html += '<div class="chips" style="margin-bottom:16px">' +
        p.stack.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + '</div>';

      html += '<div class="field-label">必须实现的功能</div><div>';
      p.features.forEach(function (f, i) {
        var id = p.id + ".item" + i;
        html += '<div class="task' + (state.tasks[id] ? " done" : "") + '" data-action="toggle-task" data-id="' + id + '">' +
          '<span class="box">✓</span><span class="task-text">' + esc(f) + '</span></div>';
      });
      html += '</div>';

      html += '<div class="field-label" style="margin-top:16px">交付物（写进 README）</div><div>';
      p.deliverables.forEach(function (d, i) {
        var id = p.id + ".item" + (p.features.length + i);
        html += '<div class="task' + (state.tasks[id] ? " done" : "") + '" data-action="toggle-task" data-id="' + id + '">' +
          '<span class="box">✓</span><span class="task-text">' + esc(d) + '</span></div>';
      });
      html += '</div>';

      html += '<div class="field" style="margin-top:18px">' +
        '<div class="field-label ok">简历可以这么写</div>' +
        '<div class="res"><span class="res-note" style="flex:1;color:var(--text)">' + esc(p.resume) + '</span>' +
        '<button class="btn small" data-action="copy" data-copy="' + esc(p.resume) + '">复制</button></div></div>';

      html += '</div>';
    });

    html += '<div class="card"><div class="section-head"><span class="section-title">每个仓库必须有的东西</span></div>' +
      '<ul class="check-list">' +
      ["一句话价值描述 + 截图或 GIF + 在线 Demo 链接",
       "架构图（mermaid 也可以）",
      "快速开始：3 条命令内能跑起来",
       "评测结果表格与失败案例分析",
       "技术选型说明与「我踩过的坑」",
       "清晰的提交历史与 issue / PR 记录"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      '</ul></div>';

    $("#view-projects").innerHTML = html;
  }

  /* ---------------- 面试题库 ---------------- */
  var intFilter = "all";
  var onlyUnmastered = false;
  var openFlashes = {};

  function renderInterview() {
    var cats = ["all"].concat(INTERVIEW.map(function (x) { return x.cat; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var masteredCount = Object.keys(state.mastered).filter(function (k) { return state.mastered[k]; }).length;

    var html = "";
    html += '<div class="page-head">' +
      '<div class="page-kicker">阶段 9 · 第 23-24 周</div>' +
      '<h1 class="page-title">面试题库</h1>' +
      '<p class="page-goal">20 道高频题与答题要点。先自己想一遍再展开对照，能说清「为什么」才算掌握。' +
      '建议每天攻克 2 道，面试前全部过一遍。</p></div>';

    html += '<div class="card tight"><div class="progress-line">' +
      '<span style="font-size:12.5px;color:var(--text-dim);flex:0 0 auto">已掌握</span>' +
      '<div class="bar"><i style="width:' + pct(masteredCount, INTERVIEW.length) + '%"></i></div>' +
      '<span>' + masteredCount + " / " + INTERVIEW.length + '</span></div></div>';

    html += '<div class="card tight"><div class="chips">';
    cats.forEach(function (c) {
      var label = c === "all" ? "全部" : c;
      html += '<button class="chip" data-action="filter-interview" data-arg="' + esc(c) + '" ' +
        'style="cursor:pointer;' + (intFilter === c ? 'border-color:var(--accent);color:var(--accent)' : '') + '">' +
        esc(label) + '</button>';
    });
    html += '<button class="chip" data-action="toggle-unmastered" style="cursor:pointer;' +
      (onlyUnmastered ? 'border-color:var(--accent);color:var(--accent)' : '') + '">只看未掌握</button>';
    html += '</div></div>';

    var shown = 0;
    INTERVIEW.forEach(function (item, i) {
      if (intFilter !== "all" && item.cat !== intFilter) return;
      if (onlyUnmastered && state.mastered[i]) return;
      shown++;
      var open = !!openFlashes[i];
      var mastered = !!state.mastered[i];
      html += '<div class="flash' + (open ? " open" : "") + (mastered ? " mastered" : "") + '">' +
        '<div class="flash-head" data-action="toggle-flash" data-id="' + i + '">' +
        '<span class="badge">' + esc(item.cat) + '</span>' +
        '<span class="flash-q">' + esc(item.q) + '</span>' +
        '<span class="caret">' + (open ? "▼" : "▶") + '</span>' +
        '</div>' +
        '<div class="flash-body"><ul>' +
        item.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
        '</ul><div class="practice-actions">' +
        '<button class="btn small' + (mastered ? "" : " primary") + '" data-action="master-flash" data-id="' + i + '">' +
        (mastered ? "取消已掌握" : "我掌握了") + '</button>' +
        '</div></div></div>';
    });

    if (!shown) html += '<div class="empty">当前筛选下没有题目。</div>';

    html += '<div class="card" style="margin-top:20px"><div class="section-head"><span class="section-title">项目讲述模板</span></div>' +
      '<ul class="check-list">' +
      ["背景：业务上有什么痛点，原来的方案为什么不行",
       "任务：我负责什么，目标指标是什么",
       "行动：架构怎么设计，关键决策有哪些（对比两个方案并说清取舍）",
       "结果：指标提升多少、成本多少、延迟多少、还有什么没解决",
       "反思：如果重来一次会怎么改"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      '</ul></div>';

    $("#view-interview").innerHTML = html;
  }

  /* ---------------- 学习日志 ---------------- */
  function renderLog() {
    var mins = totalMinutes();
    var html = "";

    html += '<div class="page-head">' +
      '<div class="page-kicker">坚持的记录</div>' +
      '<h1 class="page-title">学习日志</h1>' +
      '<p class="page-goal">每天花 2 分钟记录今天学了什么、卡在哪里。这些记录既是复盘材料，也是面试时讲「我是怎么解决问题的」的素材。</p></div>';

    html += '<div class="grid cols-3" style="margin-bottom:16px">' +
      statCard("累计学习", (mins / 60).toFixed(1) + "h", mins + " 分钟") +
      statCard("日志条数", String(state.logs.length), "平均每天一条最理想") +
      statCard("番茄数", String(state.pomodoro), "每个 25 分钟") +
      '</div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">写一条日志</span></div>' +
      '<div class="log-form">' +
      '<textarea class="note" id="logText" placeholder="今天学了什么？做了什么练习？卡在哪里？明天打算做什么？"></textarea>' +
      '<div class="log-row">' +
      '<input type="date" id="logDate" value="' + todayStr() + '">' +
      '<input class="num" type="number" id="logMin" min="0" max="1440" step="5" placeholder="分钟" value="120">' +
      '<button class="btn primary" data-action="add-log">添加记录</button>' +
      '</div></div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">历史记录</span><span class="spacer"></span>' +
      '<button class="btn ghost small" data-action="export-log" style="' + (state.logs.length ? "" : "display:none") + '">导出为 Markdown</button></div>';
    if (!state.logs.length) {
      html += '<div class="empty">还没有记录。写下第一条，开始你的 24 周旅程。</div>';
    } else {
      var sorted = state.logs.map(function (l, i) { return { l: l, i: i }; })
        .sort(function (a, b) { return (b.l.date || "").localeCompare(a.l.date || "") || (b.i - a.i); });
      sorted.forEach(function (row) {
        html += '<div class="log-entry">' +
          '<span class="log-date">' + esc(row.l.date || "") + '</span>' +
          '<span class="log-text">' + esc(row.l.text) + '</span>' +
          '<span class="log-min">' + (Number(row.l.minutes) || 0) + ' 分钟</span>' +
          '<button class="btn ghost small" data-action="del-log" data-id="' + row.i + '">删除</button>' +
          '</div>';
      });
    }
    html += '</div>';

    $("#view-log").innerHTML = html;
  }

  function exportLogMarkdown() {
    if (!state.logs.length) return toast("还没有日志可导出");
    var lines = ["# Agent 学习日志", ""];
    state.logs.map(function (l, i) { return { l: l, i: i }; })
      .sort(function (a, b) { return (a.l.date || "").localeCompare(b.l.date || ""); })
      .forEach(function (row) {
        lines.push("## " + (row.l.date || "") + "（" + (Number(row.l.minutes) || 0) + " 分钟）");
        lines.push("");
        lines.push(row.l.text);
        lines.push("");
      });
    lines.push("---");
    lines.push("累计学习：" + (totalMinutes() / 60).toFixed(1) + " 小时，番茄数：" + state.pomodoro);
    download("学习日志.md", lines.join("\n"), "text/markdown");
  }

  /* ---------------- 搜索 ---------------- */
  var searchQuery = "";

  function buildSearchIndex() {
    var idx = [];
    ROADMAP.stages.forEach(function (s) {
      var label = s.no + " " + s.title;
      s.tasks.forEach(function (t) { idx.push({ type: "任务", label: label, stage: s.id, text: t }); });
      s.topics.forEach(function (t) { idx.push({ type: "知识点", label: label, stage: s.id, text: t }); });
      s.practices.forEach(function (p) {
        idx.push({ type: "练习", label: label, stage: s.id, text: p.title });
        idx.push({ type: "练习", label: label, stage: s.id, text: p.brief });
      });
      s.resources.forEach(function (r) {
        idx.push({ type: "资源", label: label, stage: s.id, text: r.name + (r.note ? " · " + r.note : "") });
      });
      idx.push({ type: "阶段目标", label: label, stage: s.id, text: s.goal });
    });
    PROJECTS.forEach(function (p) {
      idx.push({ type: "作品", label: p.name, stage: null, view: "projects", text: p.tagline });
      p.features.concat(p.deliverables).forEach(function (t) {
        idx.push({ type: "作品", label: p.name, stage: null, view: "projects", text: t });
      });
    });
    INTERVIEW.forEach(function (q) {
      idx.push({ type: "面试题", label: q.cat, stage: null, view: "interview", text: q.q });
    });
    SELFCHECK.forEach(function (t) {
      idx.push({ type: "自测", label: "自测清单", stage: null, view: "dashboard", text: t });
    });
    return idx;
  }

  function highlight(text, q) {
    var safe = esc(text);
    if (!q) return safe;
    var pos = safe.toLowerCase().indexOf(q.toLowerCase());
    if (pos < 0) return safe;
    return safe.slice(0, pos) + "<mark>" + safe.slice(pos, pos + q.length) + "</mark>" + safe.slice(pos + q.length);
  }

  function renderSearch() {
    var q = searchQuery.trim();
    var html = '<div class="page-head"><div class="page-kicker">全局搜索</div>' +
      '<h1 class="page-title">搜索结果</h1>' +
      '<p class="page-goal">' + (q ? '关键词：' + esc(q) : "在顶部搜索框输入关键词，例如 RAG、评测、LangGraph、Docker。") + '</p></div>';

    if (!q) {
      html += '<div class="empty">输入关键词开始搜索。</div>';
      $("#view-search").innerHTML = html;
      return;
    }

    var idx = buildSearchIndex();
    var results = idx.filter(function (e) { return e.text.toLowerCase().indexOf(q.toLowerCase()) >= 0; });

    html += '<div class="section-head" style="margin-bottom:12px"><span class="section-title">' +
      results.length + ' 条结果</span></div>';

    if (!results.length) {
      html += '<div class="empty">没有找到相关内容。换个关键词试试。</div>';
    } else {
      html += '<div class="search-results">';
      results.slice(0, 120).forEach(function (r) {
        var attr = r.stage ? 'data-action="goto-stage" data-arg="' + r.stage + '"'
          : 'data-action="goto-view" data-arg="' + r.view + '"';
        html += '<div class="sr-item" ' + attr + '>' +
          '<div class="sr-meta">' + esc(r.type) + " · " + esc(r.label) + '</div>' +
          '<div class="sr-text">' + highlight(r.text, q) + '</div>' +
          '</div>';
      });
      html += '</div>';
    }
    $("#view-search").innerHTML = html;
  }

  /* ---------------- 交互与状态 ---------------- */
  var currentView = "dashboard";
  var currentArg = null;
  var openPractices = {};
  var noteTimer = null;

  function syncNotesFromDOM() {
    $$("textarea[data-note]").forEach(function (ta) {
      state.notes[ta.getAttribute("data-note")] = ta.value;
    });
  }

  function refreshChrome() {
    renderGlobalProgress();
    renderNav();
    markNavActive(currentView, currentArg);
  }

  function rerender() {
    syncNotesFromDOM();
    var sc = $("#main").scrollTop;
    navigate(currentView, currentArg);
refreshChrome();
    $("#main").scrollTop = sc;
    window.scrollTo(0, 0);
  }

  function download(filename, text, mime) {
    try {
      var blob = new Blob([text], { type: (mime || "text/plain") + ";charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("已导出：" + filename);
    } catch (e) {
      toast("导出失败，请更换浏览器重试");
    }
  }

  function copyText(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast("已复制到剪贴板"); }
      catch (e) { toast("复制失败，请手动选择"); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("已复制到剪贴板"); }, fallback);
    } else {
      fallback();
    }
  }

  document.addEventListener("click", function (e) {
    var target = e.target;
    if (!target || !target.closest) return;

    var navBtn = target.closest(".nav-item[data-view]");
    if (navBtn && !navBtn.getAttribute("data-action")) {
      navigate(navBtn.getAttribute("data-view"), navBtn.getAttribute("data-arg"));
      return;
    }

    var el = target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");
    var id = el.getAttribute("data-id");

    if (action === "toggle-task") {
      state.tasks[id] = !state.tasks[id];
      saveState();
      rerender();
      return;
    }

    if (action === "toggle-practice") {
      var box = document.querySelector('[data-practice="' + id + '"]');
      if (!box) return;
      box.classList.toggle("open");
      openPractices[id] = box.classList.contains("open");
      var caret = el.querySelector(".caret");
      if (caret) caret.textContent = openPractices[id] ? "▼" : "▶";
      return;
    }

    if (action === "complete-practice") {
      state.practices[id] = !state.practices[id];
      syncNotesFromDOM();
      saveState();
      rerender();
      toast(state.practices[id] ? "练习已完成，继续保持" : "已取消完成标记");
      return;
    }

    if (action === "filter-interview") {
      intFilter = el.getAttribute("data-arg");
      renderInterview();
      return;
    }

    if (action === "toggle-unmastered") {
      onlyUnmastered = !onlyUnmastered;
      renderInterview();
      return;
    }

    if (action === "toggle-flash") {
      var flash = el.parentElement;
      flash.classList.toggle("open");
      var c2 = el.querySelector(".caret");
      if (c2) c2.textContent = flash.classList.contains("open") ? "▼" : "▶";
      return;
    }

    if (action === "master-flash") {
      state.mastered[id] = !state.mastered[id];
      saveState();
      renderInterview();
      refreshChrome();
      return;
    }

    if (action === "add-log") {
      var textEl = $("#logText");
      var text = textEl ? textEl.value.trim() : "";
      if (!text) return toast("请先写下今天的学习内容");
      var dateEl = $("#logDate");
      var minEl = $("#logMin");
      state.logs.push({
        date: (dateEl && dateEl.value) || todayStr(),
        text: text,
        minutes: Number(minEl && minEl.value) || 0
      });
      saveState();
      renderLog();
      refreshChrome();
      toast("已记录今天的学习");
      return;
    }

    if (action === "del-log") {
      var i = Number(id);
      if (!isNaN(i)) {
        state.logs.splice(i, 1);
        saveState();
        renderLog();
        refreshChrome();
        toast("已删除该条记录");
      }
      return;
    }

    if (action === "export-log") { exportLogMarkdown(); return; }

    if (action === "copy") { copyText(el.getAttribute("data-copy") || ""); return; }

    if (action === "goto-stage") { navigate("stage", el.getAttribute("data-arg")); return; }
    if (action === "goto-tutorial") { navigate("tutorials", el.getAttribute("data-arg")); return; }
    if (action === "goto-view") { navigate(el.getAttribute("data-arg")); return; }
  });

  document.addEventListener("input", function (e) {
    var ta = e.target;
    if (ta && ta.matches && ta.matches("textarea[data-note]")) {
      var key = ta.getAttribute("data-note");
      state.notes[key] = ta.value;
      clearTimeout(noteTimer);
      noteTimer = setTimeout(saveState, 600);
      var tip = document.querySelector('[data-tip="' + key + '"]');
      if (tip) {
        tip.classList.add("show");
        setTimeout(function () { tip.classList.remove("show"); }, 1200);
      }
    }
  });

  /* ---------------- 顶栏交互 ---------------- */
  function wireTopbar() {
    $("#themeBtn").addEventListener("click", function () {
      var next = document.body.classList.contains("light") ? "dark" : "light";
      applyTheme(next);
      toast(next === "light" ? "已切换到浅色主题" : "已切换到深色主题");
    });

    $("#timerToggle").addEventListener("click", function () {
      if (timer.running) pauseTimer(); else startTimer();
    });

    $("#timerReset").addEventListener("click", function () {
      resetTimer();
      toast("番茄钟已重置");
    });

    $("#menuBtn").addEventListener("click", function () {
      $("#sidebar").classList.toggle("open");
    });

    $("#exportBtn").addEventListener("click", function () {
      download("agent学习进度_" + todayStr() + ".json", JSON.stringify(state, null, 2), "application/json");
    });

    $("#importBtn").addEventListener("click", function () { $("#importFile").click(); });

    $("#importFile").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          state = Object.assign(defaultState(), data);
          saveState();
          refreshChrome();
          navigate(currentView, currentArg);
          toast("进度已导入");
        } catch (err) {
          toast("文件格式不正确，导入失败");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    $("#resetBtn").addEventListener("click", function () {
      if (!confirm("确定要清空所有学习进度、笔记和日志吗？此操作不可恢复。")) return;
      state = defaultState();
      try { localStorage.removeItem(STORE_KEY); } catch (e) {}
      saveState();
      refreshChrome();
      navigate("dashboard");
      toast("已重置所有进度");
    });

    var si = $("#searchInput");
    si.addEventListener("input", function () {
      searchQuery = si.value;
      if (searchQuery.trim()) navigate("search");
      else if (currentView === "search") navigate(currentView);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== si) {
        e.preventDefault();
        si.focus();
        si.select();
      }
      if (e.key === "Escape" && document.activeElement === si) {
        si.value = "";
        searchQuery = "";
        si.blur();
      }
    });
  }

  function storageStatusNotice() { try { localStorage.setItem("agentHub.probe", "1"); localStorage.removeItem("agentHub.probe"); } catch (e) { storageOk = false; } if (!storageOk) { setTimeout(function () { toast("提示：当前环境无法自动保存进度，请用顶栏的导出按钮备份"); }, 900); } }

  /* =========================================================
     定制路线模块：个人情况自测 + 阶段提示
     ========================================================= */
  function attrCode(s) {
    return esc(s).replace(/\n/g, "&#10;");
  }

  function entryTestDone() {
    var n = 0;
    for (var i = 0; i < PERSONAL.entryTest.length; i++) if (state.tasks["entry." + i]) n++;
    return n;
  }

  function recommendStart() {
    var n = entryTestDone();
    if (n <= 3) return "你勾选了 " + n + "/8。建议从【阶段 1】开始，花 2 周补 Python 基础，重点补函数与异常、文件读写、pytest。";
    if (n <= 6) return "你勾选了 " + n + "/8。建议从【阶段 2】开始，边做实战 02 边补 async/await 与类型注解。";
    return "你勾选了 " + n + "/8。基础已经够用，直接从【阶段 3 工具调用】开始，第 1 周先把实战 01 的 Git 流程走一遍。";
  }

  function tutorialForStage(stageId) {
    var map = { s2: ["t2"], s3: ["t3"], s4: ["t4"], s5: ["t5", "t6"], s6: ["t8"], s7: ["t7"] };
    return map[stageId] || [];
  }

  function renderPersonalBanner() {
    var html = "";
    html += '<div class="card personal">' +
      '<div class="section-head"><span class="badge accent">为你定制</span>' +
      '<span class="section-title">' + esc(PERSONAL.title) + '</span></div>' +
      '<p style="margin:0 0 12px;color:var(--text-dim)">' + esc(PERSONAL.headline) + '</p>';

    html += '<div class="chips" style="margin-bottom:16px">' +
      '<span class="chip">' + esc(PERSONAL.weekly) + '</span>' +
      '<span class="chip">' + esc(PERSONAL.total) + '</span>' +
      '<span class="chip">学习仓库：' + esc(PERSONAL.repoShort) + '</span>' +
      '<span class="chip">代码目录：' + esc(PERSONAL.workDir) + '</span>' +
      '</div>';

    html += '<div class="grid cols-2">';
    PERSONAL.changes.forEach(function (c) {
      html += '<div class="res" style="align-items:flex-start">' +
        '<span class="badge amber">' + esc(c.tag) + '</span>' +
        '<span style="flex:1"><b style="font-size:13.5px">' + esc(c.title) + '</b><br>' +
        '<span class="res-note">' + esc(c.text) + '</span></span></div>';
    });
    html += '</div>';

    html += '<div class="field-label" style="margin-top:18px">入口自测：勾选你确定已经会做的</div><div>';
    PERSONAL.entryTest.forEach(function (q, i) {
      var id = "entry." + i;
      html += '<div class="task' + (state.tasks[id] ? " done" : "") + '" data-action="toggle-task" data-id="' + id + '">' +
        '<span class="box">✓</span><span class="task-text">' + esc(q) + '</span></div>';
    });
    html += '</div>';
    html += '<div class="res" style="margin-top:8px"><span class="res-name">建议起点</span>' +
      '<span class="res-note" style="flex:1;color:var(--text)">' + esc(recommendStart()) + '</span></div>';

    html += '<div class="field-label" style="margin-top:18px">' + esc(PERSONAL.gitPlan.title) + '</div>' +
      '<ul class="check-list">' + PERSONAL.gitPlan.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ul>' +
      '<p style="color:var(--text-faint);font-size:13px">' + esc(PERSONAL.gitPlan.branchTip) + '</p>' +
      '<p style="color:var(--amber);font-size:13px">' + esc(PERSONAL.repoAdvice) + '</p>';

    html += '<div class="practice-actions">' +
      '<button class="btn primary small" data-action="goto-view" data-arg="tutorials">开始做实战项目 →</button>' +
      '<button class="btn small" data-action="goto-view" data-arg="projects">看作品集标准</button>' +
      '<button class="btn small" data-action="goto-view" data-arg="sync">云同步进度</button>' +
      '</div>';

    html += '</div>';
    return html;
  }

  function personalStageHtml(stageId) {
    var note = PERSONAL.stageNotes[stageId];
    if (!note) return "";
    var tuts = tutorialForStage(stageId);
    var html = '<div class="card tight personal-mini">' +
      '<div class="section-head" style="margin-bottom:6px">' +
      '<span class="badge accent">为你定制</span>' +
      '<span class="badge amber">' + esc(note.status) + '</span>' +
      '<span class="spacer"></span>';
    if (tuts.length) {
      html += '<button class="btn small primary" data-action="goto-tutorial" data-arg="' + tuts[0] + '">' +
        '对应实战教程 →</button>';
    }
    html += '</div>' +
      '<div style="color:var(--text-dim);font-size:13.5px">' + esc(note.text) + '</div>';
    if (tuts.length > 1) {
      html += '<div class="chips" style="margin-top:8px">' +
        tuts.slice(1).map(function (t) {
          return '<button class="chip" style="cursor:pointer" data-action="goto-tutorial" data-arg="' + t + '">另见 ' + t.toUpperCase() + '</button>';
        }).join("") + '</div>';
    }
    html += '</div>';
    return html;
  }

  /* =========================================================
     实战教程：列表页 + 详情页
     ========================================================= */
  function tutorialStepId(tid, i) { return tid + ".s" + i; }

  function tutorialProgress(t) {
    var total = t.steps.length, done = 0;
    for (var i = 0; i < total; i++) if (state.tasks[tutorialStepId(t.id, i)]) done++;
    return { total: total, done: done, percent: pct(done, total) };
  }

  function tutorialTotalCount() {
    return TUTORIALS.reduce(function (sum, t) { return sum + t.steps.length; }, 0);
  }

  function tutorialDoneCount() {
    return TUTORIALS.reduce(function (sum, t) { return sum + tutorialProgress(t).done; }, 0);
  }

  function renderTutorialView(view, arg) {
    if (view === "tutorials" && arg) renderTutorialDetail(arg);
    else renderTutorialList();
  }

  function renderTutorialList() {
    var doneTotal = tutorialDoneCount(), allTotal = tutorialTotalCount();
    var html = "";

    html += '<div class="page-head">' +
      '<div class="page-kicker">动手才是唯一捷径</div>' +
      '<h1 class="page-title">项目实战教程</h1>' +
      '<p class="page-goal">8 个教程，从环境标准化一路做到企业级上线。每一步都写明在哪个软件操作、执行什么命令、预期看到什么结果、报错怎么办。' +
      '所有项目都建立在真实开源项目之上，先复刻、再改造、最后加上量化指标。</p></div>';

    html += '<div class="card tight"><div class="progress-line">' +
      '<span style="font-size:12.5px;color:var(--text-dim);flex:0 0 auto">教程总进度</span>' +
      '<div class="bar"><i style="width:' + pct(doneTotal, allTotal) + '%"></i></div>' +
      '<span>' + doneTotal + " / " + allTotal + ' 步</span></div></div>';

    html += '<div class="grid cols-2">';
    TUTORIALS.forEach(function (t) {
      var p = tutorialProgress(t);
      var lv = t.level === "核心" ? "green" : (t.level === "前沿" ? "accent" : (t.level === "必做" ? "amber" : ""));
      html += '<div class="card tut-card">' +
        '<div class="section-head" style="margin-bottom:6px">' +
        '<span class="badge">' + esc(t.no) + '</span>' +
        '<span class="badge ' + lv + '">' + esc(t.level) + '</span>' +
        '<span class="spacer"></span>' +
        '<span class="badge">' + esc(t.time) + '</span>' +
        '</div>' +
        '<div style="font-weight:650;font-size:15px;line-height:1.45;margin-bottom:6px">' + esc(t.title) + '</div>' +
        '<div style="color:var(--text-faint);font-size:13px;margin-bottom:10px">' + esc(t.goal) + '</div>' +
        '<div class="chips" style="margin-bottom:12px">' +
        t.tags.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join("") + '</div>' +
        '<div class="progress-line" style="margin-bottom:10px"><div class="bar"><i style="width:' + p.percent + '%"></i></div>' +
        '<span>' + p.done + "/" + p.total + '</span></div>' +
        '<button class="btn primary small" data-action="goto-tutorial" data-arg="' + t.id + '">打开教程（' + t.steps.length + ' 步）→</button>' +
        '</div>';
    });
    html += '</div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">' + esc(REPLICATION.title) + '</span>' +
      '<span class="section-sub">' + esc(REPLICATION.subtitle) + '</span></div><div>';
    REPLICATION.steps.forEach(function (s) {
      html += '<div class="res" style="align-items:flex-start">' +
        '<span class="badge accent">' + s.n + '. ' + esc(s.name) + '</span>' +
        '<span style="flex:1;font-size:13.5px;color:var(--text-dim)">' + esc(s.text) + '</span>' +
        '<span class="res-arrow">' + esc(s.time) + '</span></div>';
    });
    html += '</div><ul class="check-list" style="margin-top:12px">' +
      REPLICATION.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">18 周执行计划（按你的基础定制）</span>' +
      '<span class="section-sub">' + esc(PERSONAL.weekly) + '</span></div><div class="res-list">';
    PLAN18.forEach(function (w) {
      html += '<div class="res" style="align-items:flex-start">' +
        '<span class="badge accent" style="min-width:76px">' + esc(w.week) + '</span>' +
        '<span style="flex:1"><b style="font-size:13.5px">' + esc(w.focus) + '</b><br>' +
        '<span class="res-note">' + esc(w.detail) + '</span></span>' +
        '<span class="res-note" style="flex:0 0 34%;text-align:right">产出：' + esc(w.output) + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">企业落地项目地图</span>' +
      '<span class="section-sub">这些方向是企业真的在花钱做的</span></div><div class="res-list">';
    BUSINESS.forEach(function (b) {
      html += '<div class="res" style="align-items:flex-start">' +
        '<span class="badge green" style="min-width:150px">' + esc(b.scene) + '</span>' +
        '<span style="flex:1;font-size:13px;color:var(--text-dim)">' + esc(b.stack) + '<br>' + esc(b.roi) + '</span>' +
        '<span class="badge">' + esc(b.demand) + '</span>' +
        '<span class="res-arrow">' + esc(b.project) + '</span></div>';
    });
    html += '</div></div>';

    $("#view-tutorials").innerHTML = html;
  }

  function renderTutorialDetail(id) {
    var t = TUTORIALS.filter(function (x) { return x.id === id; })[0];
    if (!t) return renderTutorialList();
    var p = tutorialProgress(t);
    var idx = TUTORIALS.indexOf(t);
    var nextT = TUTORIALS[idx + 1];

    var html = "";
    html += '<div class="practice-actions" style="margin-bottom:14px">' +
      '<button class="btn small" data-action="goto-view" data-arg="tutorials">← 返回教程列表</button>' +
      (t.repoUrl ? '<a class="btn small" href="' + esc(t.repoUrl) + '" target="_blank" rel="noopener">查看复刻来源：' + esc(t.repoName) + ' ↗</a>' : '<span class="badge">' + esc(t.repoName) + '</span>') +
      '</div>';

    html += '<div class="page-head">' +
      '<div class="page-kicker">' + esc(t.no) + ' · ' + esc(t.level) + ' · 预计 ' + esc(t.time) + '</div>' +
      '<h1 class="page-title">' + esc(t.title) + '</h1>' +
      '</div>';

    html += '<div class="grid cols-3" style="margin-bottom:16px">' +
      '<div class="card tight"><div class="field-label">目标</div><div style="font-size:13.5px;color:var(--text-dim)">' + esc(t.goal) + '</div></div>' +
      '<div class="card tight"><div class="field-label ok">交付物</div><div style="font-size:13.5px;color:var(--text-dim)">' + esc(t.deliverable) + '</div></div>' +
      '<div class="card tight"><div class="field-label hint">企业价值</div><div style="font-size:13.5px;color:var(--text-dim)">' + esc(t.business) + '</div></div>' +
      '</div>';

    html += '<div class="card tight"><div class="progress-line">' +
      '<span style="font-size:12.5px;color:var(--text-dim);flex:0 0 auto">本教程进度</span>' +
      '<div class="bar"><i style="width:' + p.percent + '%"></i></div>' +
      '<span>' + p.done + "/" + p.total + ' 步</span></div></div>';

    html += '<div class="card tight"><div class="field-label">前置条件</div><div class="chips">' +
      t.prereq.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join("") + '</div></div>';

    t.steps.forEach(function (s, i) {
      var sid = tutorialStepId(t.id, i);
      var done = !!state.tasks[sid];
      html += '<div class="card step-card' + (done ? " done" : "") + '">';
      html += '<div class="section-head" style="align-items:flex-start">' +
        '<span class="step-no' + (done ? " done" : "") + '">' + (done ? "✓" : (i + 1)) + '</span>' +
        '<span style="flex:1">' +
        '<span class="section-title" style="display:block">' + esc(s.title) + '</span>' +
        '<span class="where-badge">在 ' + esc(s.where) + ' 操作</span>' +
        '</span>' +
        '<button class="btn small' + (done ? "" : " primary") + '" data-action="toggle-task" data-id="' + sid + '">' +
        (done ? "已完成" : "标记完成") + '</button>' +
        '</div>';

      html += '<div class="field-label">做什么</div><ul class="check-list">' +
        s.do.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul>';

      if (s.cmd && s.cmd.length) {
        html += '<div class="field-label">在终端执行</div><div class="cmd-box">';
        s.cmd.forEach(function (c) {
          html += '<div class="cmd-line"><code>' + esc(c) + '</code>' +
            '<button class="btn small" data-action="copy" data-copy="' + attrCode(c) + '">复制</button></div>';
        });
        html += '</div>';
      }

      if (s.code) {
        html += '<div class="field-label">代码（复制到文件里）</div>' +
          '<div class="code-box"><button class="btn small" data-action="copy" data-copy="' + attrCode(s.code) + '">复制代码</button>' +
          '<pre>' + esc(s.code) + '</pre></div>';
      }

      if (s.expect) {
        html += '<div class="expect-box"><b>预期结果</b><br>' + esc(s.expect) + '</div>';
      }
      if (s.tip) {
        html += '<div class="tip-box"><b>提示 / 踩坑</b><br>' + esc(s.tip) + '</div>';
      }

      html += '<div class="field-label" style="margin-top:14px">这一步的笔记（自动保存）</div>' +
        '<textarea class="note" data-note="step:' + sid + '" placeholder="记录你实际遇到的报错、解决方式、截图链接…">' +
        esc(state.notes["step:" + sid] || "") + '</textarea>';

      html += '</div>';
    });

    html += '<div class="card"><div class="section-head"><span class="section-title">完成验收</span>' +
      '<span class="section-sub">全部满足才算真正做完</span></div><ul class="check-list">' +
      t.check.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">常见报错与解决</span></div>' +
      '<div class="res-list">';
    t.errors.forEach(function (e) {
      html += '<div class="err-row"><div class="err-what">' + esc(e[0]) + '</div>' +
        '<div class="err-fix">' + esc(e[1]) + '</div></div>';
    });
    html += '</div></div>';

    html += '<div class="card"><div class="section-head"><span class="section-title">做完之后继续改造</span>' +
      '<span class="section-sub">这一步才拉开与他人的差距</span></div><ul class="check-list">' +
      t.extend.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>';

    html += '<div class="grid cols-2" style="margin-top:20px">' +
      '<button class="btn" data-action="goto-view" data-arg="tutorials">← 返回教程列表</button>' +
      (nextT ? '<button class="btn primary" data-action="goto-tutorial" data-arg="' + nextT.id + '" style="text-align:right">' + esc(nextT.no) + ' ' + esc(nextT.title) + ' →</button>'
             : '<button class="btn primary" data-action="goto-view" data-arg="projects" style="text-align:right">去打磨作品集 →</button>') +
      '</div>';

    $("#view-tutorials").innerHTML = html;
  }


  /* ---------------- 对外接口（云同步模块使用） ---------------- */
  window.__agentHub = {
    getState: function () { return state; },
    replaceState: function (next) {
      state = Object.assign(defaultState(), next);
      saveState();
      refreshChrome();
      navigate(currentView, currentArg);
    },
    onSave: function (fn) { saveHooks.push(fn); },
    toast: toast
  };
  /* ---------------- 启动 ---------------- */
  function init() {
    initTheme();
    renderBrand();
    renderNav();
    renderGlobalProgress();
    renderTimer();
    wireTopbar();

    var menu = $("#menuBtn");
    function syncMenu() { menu.style.display = window.innerWidth <= 860 ? "grid" : "none"; }
    syncMenu();
    window.addEventListener("resize", syncMenu);

    window.addEventListener("hashchange", navigateFromHash);
    navigateFromHash(); storageStatusNotice();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();






