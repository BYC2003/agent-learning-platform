/* =========================================================
   为你定制的路线数据
   背景：已装 Git / VS Code / Python，已有 GitHub 账号与仓库
   ========================================================= */

const PERSONAL = {
  title: "你的定制路线",
  headline: "你有 Git、VS Code、Python 和 GitHub 账号，所以跳过环境搭建，把时间全部压在「能落地 + 够前沿」的 8 个实战项目上。",
  weekly: "每周约 20 小时（工作日 2-3 小时 + 周末 4-6 小时）",
  total: "约 18 周（4-5 个月）达到可投递水平",
  workDir: "E:\\Project\\0基础学agent\\实战项目",
  repo: "https://github.com/BYC2003/git123.git",
  repoShort: "BYC2003/git123",
  repoAdvice: "git123 这个名字不利于求职展示。建议先把学习记录放在它里面，等到做旗舰作品时，再新建 2-3 个名字专业的仓库（如 enterprise-rag-agent、mcp-tool-server）。",

  background: [
    "已有 Git，会用基本命令",
    "已有 VS Code，能编辑文件",
    "已安装 Python",
    "已有 GitHub 账号",
    "已有仓库：" + "BYC2003/git123"
  ],

  changes: [
    { tag: "跳过", title: "阶段 0 环境搭建", text: "你已具备，只做一次版本检查（T1 第 1-3 步）即可，不用花一整周。" },
    { tag: "压缩", title: "阶段 1 Python 基础", text: "不再从零学语法，改成「用项目补短板」：类型注解、pytest、async/await 三个高频点必须补上，各花半天。" },
    { tag: "提前", title: "实战教程贯穿全程", text: "8 个教程按顺序做，做完第 5 个你就已经超过大部分只会调 API 的候选人。" },
    { tag: "重点", title: "RAG + MCP + 工作流", text: "企业最愿意付钱的三件事：知识库问答、内部系统接入、审批流程自动化，也就是 T4 / T5 / T6。" },
    { tag: "前沿", title: "浏览器 Agent + 评测观测", text: "T7 与 T8 决定你是「会用框架」还是「能把 Agent 做成产品」，这是拉开差距的部分。" },
    { tag: "产出", title: "每个教程 = 一个 GitHub 仓库", text: "8 个教程至少沉淀 5 个仓库，其中 3 个打磨成作品集。" }
  ],

  entryTest: [
    "我能用 python -m venv 创建虚拟环境并激活它",
    "我能用 VS Code 打开文件夹，并在内置终端里运行命令",
    "我能写函数、类、列表字典，并用 try/except 处理异常",
    "我会用 pip 安装依赖，并导出 requirements.txt",
    "我能用 Git 提交代码并推送到 GitHub",
    "我会用 requests 或 httpx 调 API 并解析 JSON",
    "我写过 pytest 测试，或者至少用过 assert 验证结果",
    "我理解 async / await，知道它和同步代码的区别"
  ],

  stageNotes: {
    s0: { status: "已完成", text: "你已装好 Git / VS Code / Python，只需在 T1 里核对版本号，这个阶段可以直接跳过。" },
    s1: { status: "压缩到 1 周", text: "不从零学语法。只补三件事：类型注解与 pydantic、pytest 写测试、async/await 并发。其余靠做项目补。" },
    s2: { status: "必做 · 2 周", text: "对应实战教程 T2。重点是流式输出、结构化输出、成本与延迟统计，这三样面试必问。" },
    s3: { status: "必做 · 2 周", text: "对应实战教程 T3。先复刻官方 SDK 示例，再改造成你自己的工具 Agent，手写一次 ReAct 循环。" },
    s4: { status: "核心 · 3 周", text: "对应实战教程 T4。这是企业需求最大的方向，必须有评测数据，否则你的 RAG 只是玩具。" },
    s5: { status: "核心 · 3 周", text: "对应实战教程 T5 与 T6：MCP 负责接入内部系统，LangGraph 负责可控工作流 + 人工审批。" },
    s6: { status: "必做 · 2 周", text: "对应实战教程 T8。会 Docker 部署 + 有 Trace + 能跑评测，才算「能交付」，不是「能演示」。" },
    s7: { status: "差异化 · 2 周", text: "对应实战教程 T7 浏览器 Agent。属于前沿亮点，做完在简历上是明显区分项。" },
    s8: { status: "收尾 · 2 周", text: "把 T4 / T6 / T8 打磨成 3 个作品集项目，写好 README、架构图与量化指标。" },
    s9: { status: "冲刺 · 2 周", text: "用真实 JD 做能力对照，每天 2 道高频题，开始投递。你已经做过 8 个实战项目，面试素材足够。" }
  },

  gitPlan: {
    title: "8 个教程如何用 GitHub 管理",
    steps: [
      "在 E:\\Project\\0基础学agent\\实战项目 下建 t1 到 t8 共 8 个文件夹，每个教程一个独立项目。",
      "每个项目单独 git init，并新建一个 GitHub 仓库（名字用英文小写加连字符）。",
      "git123 作为「学习总仓库」：放学习笔记、每天的日志导出、踩坑记录。",
      "每个项目第一件事就是写 README.md（要做什么、怎么运行、当前进度）。",
      "每完成一个功能就 commit 一次，提交信息用 feat / fix / docs / chore 开头。",
      "项目做完后把 README 补全：架构图、评测结果、如何复现，然后钉在 GitHub 主页。"
    ],
    branchTip: "从 T4 开始，尝试用分支开发：main 保持可运行，新功能开 feature/xxx 分支，做完再合并。这是企业里的标准做法。"
  }
};
