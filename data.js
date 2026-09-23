/* =========================================================
   Agent 应用开发学习平台 · 课程数据
   说明：本文件定义全部学习内容。
   想增删课程、任务、练习，直接修改下面的数据即可，
   不需要改动 app.js。
   ========================================================= */

const ROADMAP = {
  siteTitle: "Agent 应用开发学习平台",
  subtitle: "0 基础 → 可入职 · 24 周路线",
  stages: [

/* ---------------- 阶段 0 ---------------- */
{
  id: "s0",
  no: "阶段 0",
  weeks: "第 0 周",
  title: "环境搭建",
  duration: "1 周",
  goal: "电脑上能顺畅写代码、用 Git 管理代码，不被环境问题劝退。这一步没做完，后面每一步都会卡。",
  topics: [
    "Python 3.11+ 安装与虚拟环境（uv / venv）",
    "VS Code + Python 插件 + Ruff 格式化",
    "Git 与 GitHub 账号、SSH Key 配置",
    "终端基础命令",
    "申请一个大模型 API Key"
  ],
  tasks: [
    "安装 Python 3.11+，终端执行 python --version 能看到版本号",
    "安装 VS Code，并装好 Python、Ruff 插件",
    "用 uv 或 venv 创建并激活第一个虚拟环境",
    "注册 GitHub 账号，配置 SSH Key，能免密 clone",
    "掌握 clone / add / commit / push / branch / PR 六个操作",
    "掌握 cd / ls / mkdir / cat / pip / python 等终端命令",
    "申请一个大模型 API Key（DeepSeek / 通义 / 智谱 / OpenAI 任选）",
    "写一个 hello.py 并推送到自己的第一个 GitHub 仓库"
  ],
  practices: [
    {
      title: "练习 0-1：创建你的第一个仓库",
      brief: "在 GitHub 新建仓库 hello-agent，本地用命令行把它 clone 下来，写一个读取命令行参数并打印问候语的脚本，分 3 次 commit 后 push。",
      hint: "命令顺序：git clone → 写代码 → git add → git commit -m 说明 → git push。提交信息要写清楚做了什么，不要写 update 这种废话。",
      criteria: "GitHub 上能看到 3 条有意义的 commit，仓库里有 hello.py 和 README.md。"
    }
  ],
  acceptance: [
    "本地能运行 Python 脚本",
    "能把代码推送到自己的 GitHub 仓库",
    "知道虚拟环境的作用，会激活和退出"
  ],
  resources: [
    { name: "Python 官方教程（中文）", url: "https://docs.python.org/zh-cn/3/tutorial/", note: "只看到第 5 章即可" },
    { name: "GitHub 官方入门", url: "https://docs.github.com/zh/get-started", note: "重点看 Hello World 与 Git 基础" },
    { name: "uv 官方文档", url: "https://docs.astral.sh/uv/", note: "比 pip 更快的现代工具" }
  ]
},

/* ---------------- 阶段 1 ---------------- */
{
  id: "s1",
  no: "阶段 1",
  weeks: "第 1-4 周",
  title: "Python + Git 基础",
  duration: "4 周",
  goal: "能独立写出 200-500 行、结构清晰、带测试的 Python 程序。这是整个职业路线里唯一的硬门槛，不要跳。",
  topics: [
    "变量、类型、条件、循环、函数、列表 / 字典 / 集合",
    "文件读写、异常处理、模块与包",
    "面向对象：类、继承、dataclass",
    "类型注解 typing 与 pydantic 数据校验",
    "requests / httpx、json、pathlib、argparse",
    "异步入门：async / await、asyncio.gather",
    "pytest 单元测试",
    "Git 分支、合并、解决冲突、.gitignore"
  ],
  tasks: [
    "掌握变量、类型、条件、循环、函数与三种容器（列表 / 字典 / 集合）",
    "掌握文件读写与 try/except 异常处理",
    "掌握模块导入与包的组织方式",
    "掌握类、继承、dataclass 的写法",
    "会用 typing 类型注解与 pydantic 做输入校验",
    "会用 requests 或 httpx 调用 HTTP API 并解析 JSON",
    "理解 async / await，会用 asyncio.gather 并发请求",
    "用 pytest 写出 10 个以上测试用例并全部通过",
    "会用 Git 分支开发，并亲手解决一次合并冲突",
    "项目 1：命令行记账工具（JSON 存储 + argparse 参数解析）",
    "项目 2：批量文件整理工具（按扩展名或日期归档）",
    "项目 3：调用一个公开 API 的批量查询器"
  ],
  practices: [
    {
      title: "练习 1-1：命令行记账工具",
      brief: "实现 add / list / summary 三个子命令，数据存到本地 JSON 文件，金额非法时给出友好报错，并为每个子命令写至少 2 个 pytest 用例。",
      hint: "先用 argparse 定义子命令，把业务逻辑抽成独立函数（方便测试），最后再写文件读写。不要在 main 函数里堆所有逻辑。",
      criteria: "python main.py add 30 午餐 能写入；list 能看到记录；summary 能算总额；pytest 全绿。"
    },
    {
      title: "练习 1-2：批量文件整理",
      brief: "扫描指定目录，按扩展名把文件移动到对应子目录，支持 --dry-run 预览模式，重复文件名不覆盖而是加序号。",
      hint: "用 pathlib.Path 遍历，先实现 dry-run 只打印计划，确认无误后再真正移动。这就是「先验证再执行」的思想，后面 Agent 工具设计会反复用到。",
      criteria: "dry-run 输出与真实执行结果一致，重复文件不会被覆盖。"
    },
    {
      title: "练习 1-3：异步并发请求",
      brief: "用 httpx 异步并发请求 20 个 URL，统计耗时，并与同步写法对比，把结果写进 README。",
      hint: "asyncio.gather 同时发起请求；注意设置 timeout，否则一个慢请求会拖死整批。",
      criteria: "README 里有同步 vs 异步的耗时对比表，能说清为什么异步更快。"
    }
  ],
  acceptance: [
    "代码有 README、清晰目录结构、依赖文件（requirements.txt 或 pyproject.toml）",
    "pytest 全部通过，ruff 或 black 格式检查通过",
    "至少 20 次有意义的 commit，而不是最后一次性上传"
  ],
  resources: [
    { name: "30-Days-Of-Python", url: "https://github.com/Asabeneh/30-Days-Of-Python", note: "最受欢迎的 Python 入门练习库" },
    { name: "learn-python3", url: "https://github.com/jerry-git/learn-python3", note: "带 Jupyter 的语法速查" },
    { name: "pytest 官方文档", url: "https://docs.pytest.org/", note: "边写边查" },
    { name: "Pydantic 官方文档", url: "https://docs.pydantic.dev/", note: "后面所有结构化输出都靠它" }
  ]
},

/* ---------------- 阶段 2 ---------------- */
{
  id: "s2",
  no: "阶段 2",
  weeks: "第 5-6 周",
  title: "LLM 应用基础",
  duration: "2 周",
  goal: "理解大模型 API 的工作方式，能写出一个可流式输出、有错误处理、能算成本的聊天服务。",
  topics: [
    "Token、上下文窗口、temperature、top_p、max_tokens",
    "Chat Completions / Responses API 请求与响应结构",
    "流式输出 SSE 原理与实现",
    "结构化输出：JSON Schema + Pydantic 校验与失败重试",
    "Prompt 基础：角色、少样本、输出格式约束",
    "成本与延迟：计费、缓存、并发、超时重试",
    "安全基础：Prompt 注入、敏感信息、内容过滤"
  ],
  tasks: [
    "搞清楚 Token 与上下文窗口，知道怎么估算一次请求的成本",
    "理解 temperature / top_p / max_tokens 分别控制什么",
    "能读懂 Chat Completions 接口的请求与响应结构",
    "掌握流式输出的实现，能做到边生成边打印",
    "用 JSON Schema + Pydantic 做结构化输出并处理解析失败",
    "掌握 Prompt 的四种基础技巧：角色设定、少样本、格式约束、分步引导",
    "给 API 调用加上超时、重试与友好报错",
    "项目 A：命令行聊天机器人（多轮上下文 + 流式打印）",
    "项目 B：把项目 A 改成 FastAPI 服务，提供 /chat 与 /chat/stream",
    "项目 C：结构化信息抽取器（输入文本，输出固定 JSON Schema）"
  ],
  practices: [
    {
      title: "练习 2-1：Prompt 三轮迭代",
      brief: "针对同一个信息抽取任务，写出三版 Prompt（无约束版 / 加格式约束版 / 加少样本版），在同一批 10 条测试数据上对比成功率，把结果做成表格。",
      hint: "每版只改一个变量，否则你无法知道是哪个改动起了作用。这就是 Prompt 实验的基本方法。",
      criteria: "README 里有三版 Prompt、10 条测试数据、成功率对比表，并说明哪一步提升最大。"
    },
    {
      title: "练习 2-2：做成本与延迟报告",
      brief: "统计 20 次真实请求的 input / output token、耗时、费用，算出平均值与 P95，写进 README。",
      hint: "P95 就是把 20 个耗时从小到大排序，取第 19 个。真实业务关心的是 P95 而不是平均值。",
      criteria: "报告里有平均延迟、P95 延迟、单次平均成本、月度成本推算。"
    }
  ],
  acceptance: [
    "服务用 uvicorn 能跑起来，curl 和浏览器都能调通",
    "断网、超时、限流都有重试和友好提示",
    "README 有架构图、启动命令、请求示例、成本估算"
  ],
  resources: [
    { name: "OpenAI Cookbook", url: "https://github.com/openai/openai-cookbook", note: "官方实战示例，抄结构不抄代码" },
    { name: "Prompt Engineering Guide", url: "https://github.com/dair-ai/Prompt-Engineering-Guide", note: "Prompt 技巧大全" },
    { name: "Anthropic Courses", url: "https://github.com/anthropics/courses", note: "重点看 tool use 与 prompt 章节" },
    { name: "Microsoft Generative AI for Beginners", url: "https://github.com/microsoft/generative-ai-for-beginners", note: "生成式 AI 全景扫盲" },
    { name: "FastAPI 官方文档", url: "https://github.com/tiangolo/fastapi", note: "阶段 2 就要开始用" }
  ]
},

/* ---------------- 阶段 3 ---------------- */
{
  id: "s3",
  no: "阶段 3",
  weeks: "第 7-9 周",
  title: "工具调用与单 Agent",
  duration: "3 周",
  goal: "理解 Agent = LLM + 工具 + 循环 + 状态，写出一个真正会「办事」的 Agent，而不只是会聊天。",
  topics: [
    "Function Calling / Tool Use 完整流程与 JSON Schema 设计",
    "ReAct 范式：思考 → 行动 → 观察 → 再思考",
    "Agent 循环终止条件、最大步数、错误处理、死循环防护",
    "工具设计原则：单一职责、参数校验、幂等、精简返回",
    "记忆：短期会话、长期记忆、摘要压缩",
    "Human-in-the-loop 人工确认",
    "Agent 评测：任务成功率、步数、工具调用正确率、成本"
  ],
  tasks: [
    "彻底搞懂 Function Calling 的完整流程与 JSON Schema 写法",
    "理解 ReAct 循环，能手写一个最简 Agent 主循环",
    "给 Agent 加上最大步数、超时和死循环防护",
    "掌握工具设计四原则：单一职责、参数校验、幂等、返回精简",
    "实现多轮会话记忆，并尝试用摘要压缩长上下文",
    "实现至少一个高风险操作的人工确认（Human-in-the-loop）",
    "为 Agent 建立评测：10 个端到端任务，成功率不低于 80%",
    "工具 1：天气或新闻查询（外部 API）",
    "工具 2：SQLite 待办事项增删改查",
    "工具 3：受限目录的本地文件读写",
    "工具 4：计算器或 Python 代码沙箱（注意安全边界）",
    "给每次工具调用加日志，做到可回放每一步"
  ],
  practices: [
    {
      title: "练习 3-1：手写最简 ReAct 循环",
      brief: "不依赖任何 Agent 框架，用 while 循环 + 模型 API 手写一个能调用 2 个工具的 Agent，并把每一轮的消息记录打印出来。",
      hint: "循环结构：把工具定义发给模型 → 模型返回 tool_calls → 执行工具 → 把结果作为 tool 消息回传 → 再次调用模型，直到模型不再请求工具。",
      criteria: "能完整打印 思考 / 工具调用 / 工具返回 / 最终答案 四个阶段，且不会无限循环。"
    },
    {
      title: "练习 3-2：工具调用失败演练",
      brief: "故意制造 5 种失败：参数类型错误、工具不存在、外部 API 超时、返回内容超长、重复调用同一工具。观察 Agent 表现并修复。",
      hint: "把工具的异常信息作为观察结果返回给模型，让它自己修正参数；同时在后端做 Schema 校验兜底。这比让程序直接崩溃专业得多。",
      criteria: "5 种失败都有明确处理策略，并写进 README 的「容错设计」章节。"
    },
    {
      title: "练习 3-3：Agent 评测集",
      brief: "设计 10 个覆盖不同工具组合的任务，记录每个任务的成功与否、调用步数、耗时和成本，计算成功率。",
      hint: "成功的定义要可判定，例如「数据库里确实多了一条记录」而不是「模型说它创建了」。",
      criteria: "评测集可重复运行，成功率 ≥ 80%，有失败案例的归因分析。"
    }
  ],
  acceptance: [
    "Agent 能完成 10 个端到端任务，成功率 ≥ 80%",
    "有完整 trace 日志，能回放每一步模型输入输出",
    "面试时能讲清：工具为什么这样设计？模型调错参数怎么办？"
  ],
  resources: [
    { name: "OpenAI Agents SDK", url: "https://github.com/openai/openai-agents-python", note: "读 Runner 主循环源码" },
    { name: "Microsoft AI Agents for Beginners", url: "https://github.com/microsoft/AI-Agents-for-Beginners", note: "官方 Agent 入门课，首选" },
    { name: "Hugging Face Agents Course", url: "https://github.com/huggingface/agents-course", note: "体系化课程，按章节做作业" },
    { name: "OpenAI Function Calling 文档", url: "https://platform.openai.com/docs/guides/function-calling", note: "权威参考" }
  ]
},

/* ---------------- 阶段 4 ---------------- */
{
  id: "s4",
  no: "阶段 4",
  weeks: "第 10-12 周",
  title: "RAG 知识库",
  duration: "3 周",
  goal: "能独立搭建一套「带引用来源、能量化效果」的 RAG 系统。这是求职面试出现频率最高的考点。",
  topics: [
    "文档解析：PDF / Word / Markdown / HTML / 表格",
    "切分策略：固定长度、按标题、递归切分、重叠窗口",
    "Embedding 选型：中文效果、维度、成本、本地 vs API",
    "向量数据库：Chroma → pgvector / Qdrant / Milvus",
    "检索进阶：BM25 + 向量混合检索、Query Rewrite、HyDE、Rerank",
    "上下文组装：引用编号、去重、长度控制",
    "幻觉治理：无结果拒答、强制引用、答案校验",
    "评测：Ragas / DeepEval 的 faithfulness、context precision / recall",
    "增量更新：文档新增、删除、重新索引"
  ],
  tasks: [
    "能解析 PDF、Markdown 两类文档并清洗成纯文本",
    "掌握至少 3 种切分策略，并能说出各自的适用场景",
    "完成文档向量化并持久化到向量数据库",
    "实现 BM25 + 向量的混合检索",
    "接入 Rerank 模型对召回结果重排序",
    "实现带引用编号的回答，前端可查看原文片段",
    "实现无检索结果时的拒答逻辑",
    "自建 50 条评测集，用 Ragas 或 DeepEval 跑出指标",
    "做一个对比实验：纯向量检索 vs 混合检索 + Rerank",
    "实现文档增量更新（新增 / 删除 / 重建索引）",
    "把旗舰项目写进 README：架构图 + 评测表格 + 失败案例"
  ],
  practices: [
    {
      title: "练习 4-1：切分策略对比实验",
      brief: "用同一份 30 页 PDF，分别用固定长度、按标题、递归切分三种方式建库，在 20 个问题上对比召回率与回答质量。",
      hint: "切分太大 → 噪声多、成本高；切分太小 → 语义不完整。经验值 300-800 token 加 10%-20% 重叠，但必须用你自己的数据验证。",
      criteria: "README 里有三种策略的对比表和你的最终选择理由。"
    },
    {
      title: "练习 4-2：混合检索 + Rerank",
      brief: "实现 BM25 与向量检索的结果融合（可用 RRF 或加权），再接入 Rerank 模型重排，对比接入前后的检索命中率。",
      hint: "常见流程：两路各召回 20 条 → 融合去重 → Rerank 取前 5 条 → 交给模型。Rerank 解决的是「召回对了但排序靠后」的问题。",
      criteria: "有 before / after 命中率对比，且能解释 RRF 或加权融合的原理。"
    },
    {
      title: "练习 4-3：造 50 条评测集",
      brief: "基于你的知识库文档，人工编写 50 个问答对，覆盖事实型、多跳、需拒答三类问题，用 Ragas 跑出完整指标报告。",
      hint: "评测集必须有「标准答案」和「依据片段」。没有评测集，你所有的优化都是凭感觉，面试时无法证明效果。",
      criteria: "指标报告包含 faithfulness、answer relevancy、context precision、context recall，并有至少 3 个失败案例分析。"
    }
  ],
  acceptance: [
    "评测集上 faithfulness 与 context recall 明显优于 baseline",
    "README 有架构图、评测表格、失败案例分析",
    "能回答：为什么这么切分？为什么用这个向量库？召回不够怎么优化？"
  ],
  resources: [
    { name: "LlamaIndex", url: "https://github.com/run-llama/llama_index", note: "RAG 全链路框架" },
    { name: "RAGFlow", url: "https://github.com/infiniflow/ragflow", note: "生产级 RAG 架构，重点读流程设计" },
    { name: "Chroma", url: "https://github.com/chroma-core/chroma", note: "入门首选向量库" },
    { name: "Qdrant", url: "https://github.com/qdrant/qdrant", note: "生产级向量数据库" },
    { name: "pgvector", url: "https://github.com/pgvector/pgvector", note: "已有 Postgres 时最省事" },
    { name: "Ragas", url: "https://github.com/explodinggradients/ragas", note: "RAG 评测标准工具" },
    { name: "DeepEval", url: "https://github.com/confident-ai/deepeval", note: "LLM 应用单元测试" }
  ]
},

/* ---------------- 阶段 5 ---------------- */
{
  id: "s5",
  no: "阶段 5",
  weeks: "第 13-15 周",
  title: "编排框架与多智能体",
  duration: "3 周",
  goal: "从「写一个 Agent」升级到「设计一套可控、可恢复的工作流」。这是中级工程师的核心能力。",
  topics: [
    "LangChain 核心抽象：Model / Prompt / Parser / Retriever / Tool / Runnable",
    "LangGraph：State、Node、Edge、条件路由、Checkpoint、中断恢复",
    "OpenAI Agents SDK：Agent、Handoff、Guardrail、Session、Tracing",
    "多智能体模式：Supervisor、Planner-Executor、Debate、Critic-Reviewer",
    "什么时候不该用多智能体",
    "状态管理：会话 ID、持久化、并发隔离、断点续跑"
  ],
  tasks: [
    "掌握 LangChain 的核心抽象，能说清 Runnable 的作用",
    "掌握 LangGraph 的 State、Node、Edge 与条件路由",
    "实现 LangGraph 的 Checkpoint，做到中断后能恢复",
    "掌握 Agents SDK 的 Handoff 与 Guardrail 机制",
    "理解四种多智能体模式及其适用场景",
    "能论证「这个任务为什么不该用多智能体」",
    "实现会话状态隔离，保证并发请求不串数据",
    "项目 D：Deep Research 工作流（搜索 → 抓取 → 去重 → 归纳 → 带引用报告）",
    "项目 E：代码或文档审查多智能体（需求 → 实现 → 审查，最多 3 轮）",
    "为工作流画出状态流转图，并加上失败重试与最大轮次限制"
  ],
  practices: [
    {
      title: "练习 5-1：用 LangGraph 复刻一个官方示例",
      brief: "从 LangGraph 官方示例里挑一个（如 agentic RAG 或 self-reflection），完整跑通后，把流程图和数据流写在笔记里。",
      hint: "重点不是跑通，而是搞清楚：状态里存了什么？每个节点做什么？什么条件下走哪条边？",
      criteria: "能画出状态流转图，并解释每个字段在节点间如何变化。"
    },
    {
      title: "练习 5-2：给工作流加人工中断点",
      brief: "在生成最终报告前插入人工确认节点：用户可批准、修改意见或终止。确认后能从断点继续执行。",
      hint: "LangGraph 用 interrupt + checkpointer 实现；关键是把状态持久化，否则进程重启就丢失。",
      criteria: "中断后能恢复执行，且状态完整不丢。"
    },
    {
      title: "练习 5-3：单 Agent vs 多智能体对比",
      brief: "用同一个任务分别实现单 Agent 版本和多智能体版本，对比成功率、耗时、token 成本，得出结论。",
      hint: "很多时候单 Agent 加清晰工作流反而更优。能量化这一点，面试时是加分项。",
      criteria: "有三维度对比表和明确结论，并能说明边界条件。"
    }
  ],
  acceptance: [
    "工作流有可视化图或清晰节点说明",
    "有失败重试、超时、最大轮次、人工中断点",
    "能画出状态流转图并讲明白每一步为什么存在"
  ],
  resources: [
    { name: "LangGraph", url: "https://github.com/langchain-ai/langgraph", note: "本阶段核心，重点学" },
    { name: "LangChain", url: "https://github.com/langchain-ai/langchain", note: "核心抽象来源" },
    { name: "AutoGen", url: "https://github.com/microsoft/autogen", note: "多智能体通信机制" },
    { name: "CrewAI", url: "https://github.com/crewAIInc/crewAI", note: "多智能体快速上手" },
    { name: "MetaGPT", url: "https://github.com/geekan/MetaGPT", note: "SOP 驱动的多角色协作" },
    { name: "PydanticAI", url: "https://github.com/pydantic/pydantic-ai", note: "类型安全的新选择" },
    { name: "Agno", url: "https://github.com/agno-agi/agno", note: "轻量级 Agent 框架" }
  ]
},

/* ---------------- 阶段 6 ---------------- */
{
  id: "s6",
  no: "阶段 6",
  weeks: "第 16-18 周",
  title: "工程化、部署与可观测",
  duration: "3 周",
  goal: "把 Demo 变成「别人敢用的服务」。这是初级和合格工程师之间的分界线，也是面试最容易被问住的环节。",
  topics: [
    "FastAPI 工程化：分层结构、依赖注入、中间件、异常处理",
    "流式输出：SSE / WebSocket 与前端配合",
    "数据层：PostgreSQL + Redis，会话与缓存设计",
    "异步任务：后台任务、队列、长任务进度反馈",
    "可靠性：超时、重试、退避、熔断、降级、幂等",
    "可观测：结构化日志、Trace ID、Langfuse / Phoenix",
    "评测上线：promptfoo / DeepEval 接入 CI 自动回归",
    "成本控制：Token 统计、缓存命中、模型分级路由",
    "部署：Docker 多阶段构建、docker-compose、GitHub Actions",
    "安全：输入校验、工具权限白名单、沙箱、Prompt 注入防护、密钥管理"
  ],
  tasks: [
    "把项目改成清晰的分层结构（api / service / repository / schema）",
    "实现 SSE 流式接口并写一个能打字机效果显示的前端页面",
    "接入 PostgreSQL 存储会话与文档元数据",
    "接入 Redis 做缓存或会话状态，并说明缓存策略",
    "为所有外部调用加上超时、重试与退避",
    "接入 Langfuse 或 Phoenix，能看到每次请求的完整 trace",
    "做 Token 与成本统计，输出每日或每请求成本报告",
    "用 promptfoo 或 DeepEval 建评测集，接入 GitHub Actions 自动跑",
    "写 Dockerfile 与 docker-compose.yml（应用 + Postgres + Redis）",
    "实现模型分级路由（简单问题用小模型，复杂问题用大模型）",
    "加上 /health 健康检查与结构化日志（含 Trace ID）",
    "给项目加一个 Web UI（Streamlit / Gradio 均可）"
  ],
  practices: [
    {
      title: "练习 6-1：一条命令跑起来",
      brief: "让项目在全新机器上只需 docker compose up 就能启动，包括数据库初始化、环境变量配置和健康检查。",
      hint: "把配置全部放进 .env，代码里不要出现任何硬编码密钥。README 里写清 .env.example 的每一项含义。",
      criteria: "删除所有容器后重新 compose up 能正常运行，/health 返回 200。"
    },
    {
      title: "练习 6-2：接入可观测与成本报告",
      brief: "接入 Langfuse，记录每次请求的输入输出、token 数、耗时和成本；并按天汇总成一份报告。",
      hint: "重点是为每次请求打上统一的 trace id，并把它贯穿日志、模型调用和工具调用。排障时你会非常依赖它。",
      criteria: "能在 Langfuse 里看到完整链路，并能输出一份按天统计的成本报告。"
    },
    {
      title: "练习 6-3：可靠性演练",
      brief: "模拟模型 API 超时、限流 429、返回非法 JSON、数据库连接失败四种故障，验证系统的降级与提示是否合理。",
      hint: "超时要有上限，重试要带指数退避，限流要能降级到备用模型或排队。关键是要有明确的用户提示，而不是转圈卡死。",
      criteria: "四种故障都有可预期的处理行为，并写进 README 的可靠性章节。"
    },
    {
      title: "练习 6-4：Prompt 回归测试",
      brief: "把 20 条评测用例接入 CI，每次改动 Prompt 或模型参数时自动运行，失败则阻止合并。",
      hint: "评测指标要有阈值（例如 faithfulness ≥ 0.8），低于阈值就判定失败。这样你才敢放心改 Prompt。",
      criteria: "PR 里能看到 CI 自动跑评测的结果，且有明确通过或失败状态。"
    }
  ],
  acceptance: [
    "新机器上 docker compose up 一条命令能跑起来",
    "有 /health、有日志、有成本统计报告",
    "有线上 demo 链接或完整演示录屏"
  ],
  resources: [
    { name: "FastAPI", url: "https://github.com/tiangolo/fastapi", note: "后端服务主力" },
    { name: "Langfuse", url: "https://github.com/langfuse/langfuse", note: "开源可观测平台" },
    { name: "Arize Phoenix", url: "https://github.com/Arize-ai/phoenix", note: "Trace 与实验对比" },
    { name: "promptfoo", url: "https://github.com/promptfoo/promptfoo", note: "Prompt 回归测试" },
    { name: "Gradio", url: "https://github.com/gradio-app/gradio", note: "最快搭出 Demo 界面" },
    { name: "Streamlit", url: "https://github.com/streamlit/streamlit", note: "数据类界面首选" },
    { name: "Dify", url: "https://github.com/langgenius/dify", note: "学产品化工作流设计" },
    { name: "Open WebUI", url: "https://github.com/open-webui/open-webui", note: "可部署对照学习" }
  ]
},

/* ---------------- 阶段 7 ---------------- */
{
  id: "s7",
  no: "阶段 7",
  weeks: "第 19-20 周",
  title: "进阶亮点与差异化",
  duration: "2 周",
  goal: "从下面 6 个方向挑 1-2 个做深，制造简历上的差异化亮点。不要全做，做深比做全重要。",
  topics: [
    "MCP：协议原理、写自己的 Server 与 Client、工具鉴权",
    "浏览器 Agent：页面理解、操作规划、失败恢复、沙箱",
    "代码 Agent：仓库理解、补丁生成、执行反馈",
    "记忆系统：长期记忆抽取、冲突消解、召回策略",
    "本地模型：Ollama、vLLM、量化、吞吐与显存权衡",
    "模型网关：多模型路由、密钥管理、限流与计费"
  ],
  tasks: [
    "从 6 个方向中选定 1-2 个，写下选择理由与预期产出",
    "完成该方向的动手实现（不是只跑 Demo）",
    "阅读该方向主流项目的核心源码，写一篇笔记",
    "把进阶功能整合进你的旗舰项目，并补充 README 说明",
    "准备一份 10 分钟讲解稿：为什么需要它、怎么实现、有什么坑",
    "在 GitHub 上主动提 1-2 个 issue 或 PR（文档、测试都可以）"
  ],
  practices: [
    {
      title: "方向 A：写一个自己的 MCP Server",
      brief: "实现一个提供 2-3 个工具的 MCP Server（例如查询本地数据库 + 读取指定目录文件），并让支持 MCP 的客户端调用成功。",
      hint: "重点理解工具描述如何暴露给模型、鉴权怎么做、权限边界如何限制。MCP 正在成为工具接入的事实标准。",
      criteria: "客户端能列出并调用你的工具，有权限限制说明和使用文档。"
    },
    {
      title: "方向 B：浏览器自动化 Agent",
      brief: "让 Agent 完成一个真实的多步网页任务（例如查信息并填表），要求有失败截图、重试和步骤日志。",
      hint: "难点是页面理解与失败恢复。先做窄场景（固定网站），稳定后再泛化。务必在沙箱或测试账号里跑。",
      criteria: "成功率可统计，有失败截图与恢复策略，并且不触碰真实敏感数据。"
    },
    {
      title: "方向 C：给 Agent 加长期记忆",
      brief: "实现用户偏好与历史事实的长期存储，在后续会话中自动召回，并处理新旧信息冲突。",
      hint: "关键问题：什么时候写入记忆？召回几条？冲突时信谁？记忆太多会污染上下文，需要定期清理或摘要。",
      criteria: "跨会话能记住用户偏好，有冲突处理规则与召回效果测试。"
    }
  ],
  acceptance: [
    "能以「我为什么需要它」为主线讲 10 分钟",
    "能说清实现细节与踩过的坑，而不是只会说「我跑通了 Demo」",
    "进阶功能已整合进主线项目，而不是孤立的小脚本"
  ],
  resources: [
    { name: "MCP Python SDK", url: "https://github.com/modelcontextprotocol/python-sdk", note: "写自己的 MCP Server" },
    { name: "MCP Servers", url: "https://github.com/modelcontextprotocol/servers", note: "官方服务集合" },
    { name: "browser-use", url: "https://github.com/browser-use/browser-use", note: "浏览器 Agent" },
    { name: "SWE-agent", url: "https://github.com/SWE-agent/SWE-agent", note: "代码 Agent 经典实现" },
    { name: "OpenHands", url: "https://github.com/All-Hands-AI/OpenHands", note: "完整开发 Agent" },
    { name: "Mem0", url: "https://github.com/mem0ai/mem0", note: "长期记忆层" },
    { name: "Letta", url: "https://github.com/letta-ai/letta", note: "有状态 Agent" },
    { name: "Ollama", url: "https://github.com/ollama/ollama", note: "本地跑模型" },
    { name: "vLLM", url: "https://github.com/vllm-project/vllm", note: "高吞吐推理服务" },
    { name: "LiteLLM", url: "https://github.com/BerriAI/litellm", note: "多模型统一网关" }
  ]
},

/* ---------------- 阶段 8 ---------------- */
{
  id: "s8",
  no: "阶段 8",
  weeks: "第 21-22 周",
  title: "作品集打磨",
  duration: "2 周",
  goal: "把学过的技术沉淀成 3 个能拿得出手的作品。面试官不会看你说会什么，只会看你能做出什么。",
  topics: [
    "作品集标准：价值、复杂度、完成度、可验证性",
    "README 写法：一句话价值、架构图、快速开始、评测结果",
    "架构图与流程图画法（mermaid / Excalidraw）",
    "Demo 视频录制与在线演示部署",
    "GitHub Profile README 与仓库置顶",
    "开源贡献：文档、测试、小 bug 修复"
  ],
  tasks: [
    "完成旗舰项目：知识库 Agent（带评测与部署）",
    "完成工作流项目：Deep Research 或代码审查多智能体",
    "完成工程化项目：FastAPI + Docker + 可观测 + 评测",
    "为每个仓库补上：一句话价值 + 截图或 GIF + 在线 Demo",
    "为每个仓库画一张架构图",
    "为每个仓库写「快速开始」，确保 3 条命令内能跑起来",
    "为每个仓库补评测结果表格与失败案例分析",
    "为每个仓库写技术选型说明与踩坑记录",
    "整理 GitHub Profile README，置顶这 3 个项目",
    "提交 1-2 个真实开源 PR（修文档、补测试都可以）",
    "录制 3-5 分钟的项目演示视频",
    "准备 3 分钟和 10 分钟两个版本的项目讲解"
  ],
  practices: [
    {
      title: "练习 8-1：写出面试官愿意看的 README",
      brief: "按「一句话价值 → 效果截图 → 架构图 → 快速开始 → 核心设计 → 评测结果 → 踩坑记录」的顺序重写 README。",
      hint: "面试官最多看 60 秒。前 10 行必须让他知道这是什么、解决了什么问题、有什么量化结果。不要一上来就贴安装命令。",
      criteria: "陌生人按 README 能在 5 分钟内把项目跑起来，并能说出它解决了什么问题。"
    },
    {
      title: "练习 8-2：录一个 3 分钟演示视频",
      brief: "录屏演示核心流程，包含一次真实的成功案例和一次失败或边界情况的处理。",
      hint: "脚本：15 秒说清问题 → 1 分钟演示主流程 → 40 秒讲架构 → 30 秒给数据结果 → 20 秒讲不足与改进。",
      criteria: "视频不超过 3 分钟，有字幕或讲解，能体现你对边界情况的思考。"
    },
    {
      title: "练习 8-3：提一个真实的开源 PR",
      brief: "在你用过的框架仓库里，修一处文档错误、补充一个测试或复现并修复一个小 bug，提交 PR。",
      hint: "从 good first issue 标签开始。PR 描述要写清：问题是什么、怎么改的、怎么验证的。这是最容易被忽略的高性价比经历。",
      criteria: "PR 被合并或被维护者给出实质性反馈，链接写进简历。"
    }
  ],
  acceptance: [
    "GitHub 首页置顶 3 个作品，每个都有 Demo 与量化结果",
    "3 分钟和 10 分钟两个版本的项目讲解能脱稿完成",
    "至少 1 个真实的开源贡献记录"
  ],
  resources: [
    { name: "Awesome AI Agents", url: "https://github.com/e2b-dev/awesome-ai-agents", note: "了解同行都在做什么" },
    { name: "Awesome LangChain", url: "https://github.com/kyrolabs/awesome-langchain", note: "生态项目索引" },
    { name: "Mermaid 文档", url: "https://mermaid.js.org/", note: "在 README 里画架构图" },
    { name: "GitHub Profile README 指南", url: "https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-github-profile", note: "打造个人主页" }
  ]
},

/* ---------------- 阶段 9 ---------------- */
{
  id: "s9",
  no: "阶段 9",
  weeks: "第 23-24 周",
  title: "求职冲刺",
  duration: "2 周",
  goal: "把能力翻译成招聘方听得懂的语言，开始大规模投递。面试反馈比闭门学习值钱得多。",
  topics: [
    "简历写法：问题 → 方案 → 结果，必须有数字",
    "项目讲述：STAR 结构 + 技术取舍",
    "高频面试题：基础、Agent、RAG、工程四类",
    "投递策略：岗位筛选、关键词匹配、渠道组合",
    "面试复盘与能力对照"
  ],
  tasks: [
    "把简历压缩到 1 页，项目经历全部改成「问题 → 方案 → 结果」结构",
    "为每个项目写出 3 个可量化指标（准确率、成本、延迟、成功率）",
    "准备 3 分钟版本的项目讲解并录音自查",
    "准备 10 分钟版本的项目讲解并画白板演练",
    "整理 20 道高频面试题的答案提纲（本页面试题库可直接用）",
    "用 3 个真实 JD 做能力对照表，找出缺口并补齐",
    "建立投递表：公司、岗位、JD 关键词、进度、反馈",
    "每天 2 道高频题 + 1 次白板架构讲解",
    "开始投递，每周不少于 10 家，并持续维护项目",
    "每次面试后 24 小时内写复盘，记录被问住的问题"
  ],
  practices: [
    {
      title: "练习 9-1：把简历改到能被搜到",
      brief: "针对目标 JD 提取关键词（如 RAG、LangGraph、评测、Docker），确保简历里自然出现这些词，并有对应项目支撑。",
      hint: "HR 和简历筛选系统先做关键词筛选，技术面试官看的是项目细节。两者都要满足：关键词进技能栏，细节进项目经历。",
      criteria: "用 3 个真实 JD 逐条比对，简历能覆盖其中 80% 以上的要求。"
    },
    {
      title: "练习 9-2：模拟面试并复盘",
      brief: "找朋友或用录音方式，完整模拟 45 分钟面试：自我介绍、项目深挖、RAG 原理、一道系统设计。",
      hint: "重点记录你卡壳的地方。被问住的知识点必须当天补齐，并把它变成下一个项目的改进点。",
      criteria: "完成至少 3 次模拟面试，每次都有书面复盘与改进动作。"
    }
  ],
  acceptance: [
    "简历 1 页，3 个项目都有量化结果",
    "能脱稿完成 3 分钟与 10 分钟项目讲解",
    "每周投递不少于 10 家，并有完整投递表与复盘记录"
  ],
  resources: [
    { name: "本页面试题库", url: "#interview", note: "20 道高频题与答题要点" },
    { name: "本页作品集看板", url: "#projects", note: "3 个作品的交付清单" }
  ]
}

  ]
};

/* =========================================================
   作品集（Projects）：3 个必做作品
   ========================================================= */
const PROJECTS = [
  {
    id: "p1",
    rank: "旗舰项目",
    name: "企业 / 个人知识库 Agent",
    tagline: "上传文档，用自然语言提问，答案带出处，效果有数据可证。",
    story: "新员工想知道公司制度，把员工手册和相关文档上传后直接提问，每条回答都能点开原文。",
    stack: ["Python", "FastAPI", "LlamaIndex 或 LangGraph", "pgvector 或 Qdrant", "Ragas", "Docker"],
    features: [
      "文档上传与解析管道（至少支持 PDF + Markdown）",
      "向量化与向量库持久化",
      "BM25 + 向量混合检索",
      "接入 Rerank 重排序",
      "带引用编号的回答，可跳转原文片段",
      "多轮追问与上下文管理",
      "无检索结果时拒答",
      "文档增量更新与重新索引",
      "以 50 条评测集 + 评测报告收尾"
    ],
    deliverables: [
      "50 条自建评测集，覆盖事实型 / 多跳 / 需拒答三类问题",
      "对比实验：纯向量检索 vs 混合检索 + Rerank，给出指标差异",
      "README 架构图 + 评测表格 + 失败案例分析",
      "Docker 一键启动 + 在线 Demo 或演示视频"
    ],
    resume: "设计「混合检索 + Rerank」检索链路，将评测集 context recall 从 0.62 提升至 0.85，引用准确率 92%。"
  },
  {
    id: "p2",
    rank: "编排能力",
    name: "研究自动化工作流 Agent",
    tagline: "输入一个主题，自动搜索、抓取、去重、归纳，输出带引用的研究报告。",
    story: "原本需要人工查资料 2 小时，现在 5 分钟产出初稿，关键结论由人工确认后再定稿。",
    stack: ["Python", "LangGraph", "搜索 API", "网页解析", "FastAPI", "Redis"],
    features: [
      "LangGraph 状态机：搜索 → 抓取 → 去重 → 提炼 → 交叉验证 → 生成",
      "条件路由：信息不足时自动补搜",
      "失败重试、超时控制、最大轮次限制",
      "人工确认节点（Human-in-the-loop）",
      "最终报告导出为 Markdown",
      "完整 Trace 与成本统计"
    ],
    deliverables: [
      "状态流转图（每个节点做什么、什么条件下走哪条边）",
      "失败与恢复策略说明",
      "任务成功率、平均耗时、人工介入率、单任务成本四项指标",
      "在线 Demo 或演示视频"
    ],
    resume: "基于 LangGraph 实现带人工确认的多步工作流，长任务成功率从 68% 提升至 89%。"
  },
  {
    id: "p3",
    rank: "工程与安全",
    name: "工具型 Agent 服务",
    tagline: "能查数据库、写邮件草稿、建日程，但高风险操作必须用户确认。",
    story: "把重复的行政事务交给 Agent 处理，同时保证它不会越权执行任何敏感操作。",
    stack: ["Python", "OpenAI Agents SDK 或 LangGraph", "FastAPI", "PostgreSQL", "Redis"],
    features: [
      "Function Calling 工具集（数据库查询 / 邮件草稿 / 日程）",
      "工具权限分级：只读 / 可写 / 需确认",
      "参数 Schema 校验与异常兜底",
      "操作审计日志（谁、何时、调用了什么工具）",
      "写操作幂等设计，避免重复执行",
      "超时、限流、降级处理"
    ],
    deliverables: [
      "权限矩阵文档（每个工具的风险等级与确认要求）",
      "审计日志示例与回放方式",
      "工具调用成功率、误操作率、P95 延迟、并发压测结果",
      "接口文档与在线 Demo"
    ],
    resume: "为 8 个工具设计权限分级与幂等机制，工具调用成功率 94%，高风险操作 100% 需人工确认。"
  }
];

/* =========================================================
   面试题库：20 道高频题
   ========================================================= */
const INTERVIEW = [
  { cat: "基础", q: "Token 是什么？上下文超长怎么处理？", points: [
    "Token 是模型处理文本的最小单位，中文大约 1 字 ≈ 1-2 token。",
    "超长处理的四条路：截断（保留最近 + 系统提示）、摘要压缩、检索只取相关片段、分段处理后再汇总。",
    "要能说出取舍：摘要会丢细节，检索依赖召回质量，分段要多一次模型调用。"
  ]},
  { cat: "基础", q: "temperature 和 top_p 的区别？", points: [
    "temperature 调整概率分布的平滑程度，越高越随机。",
    "top_p 是核采样，只在累计概率前 p 的候选里选。",
    "实践经验：结构化输出与工具调用用低 temperature（0-0.3），创意写作才调高；两者一般不同时调。"
  ]},
  { cat: "基础", q: "结构化输出怎么保证稳定？", points: [
    "优先用接口原生的 JSON Schema / structured output 能力。",
    "用 Pydantic 做二次校验，失败时把错误信息回传模型重试（最多 1-2 次）。",
    "Prompt 里给字段说明和示例；对枚举值做白名单校验；兜底给默认值或直接报错。"
  ]},
  { cat: "基础", q: "流式输出怎么实现？前后端如何配合？", points: [
    "后端用 SSE（text/event-stream）逐块推送增量 token，或 WebSocket 双向通信。",
    "前端用 EventSource 或 fetch + ReadableStream 读取并增量渲染。",
    "注意点：心跳保活、错误事件、断线重连、首 token 延迟与整体延迟要分别统计。"
  ]},
  { cat: "基础", q: "怎么估算和控制一次请求的成本？", points: [
    "成本 = 输入 token × 单价 + 输出 token × 单价，要分别统计。",
    "控制手段：缩短上下文、缓存常见问答、小模型先试大模型兜底、限制 max_tokens、批量合并请求。",
    "要能给出真实数字：单次平均成本、月度推算、优化前后对比。"
  ]},
  { cat: "Agent", q: "Agent 和普通 Chatbot 的区别？", points: [
    "Chatbot 只生成文本；Agent 能调用工具、根据结果调整下一步、多轮循环直到完成任务。",
    "核心组成：LLM + 工具 + 循环控制 + 状态记忆。",
    "关键差异是「能对真实世界产生动作」，因此必须配套权限控制与审计。"
  ]},
  { cat: "Agent", q: "Function Calling 的完整流程？模型给错参数怎么办？", points: [
    "流程：把工具 Schema 发给模型 → 模型返回 tool_calls → 后端执行工具 → 结果作为 tool 消息回传 → 模型继续推理。",
    "参数错误先做 Schema 校验拦截，再把错误信息作为观察结果回传，让模型自我修正。",
    "同时限制重试次数，多次失败就转人工或返回明确的失败提示。"
  ]},
  { cat: "Agent", q: "怎么防止 Agent 死循环？最大步数怎么定？", points: [
    "设最大步数上限、单步与整体超时、相同工具调用去重检测。",
    "检测「同一工具 + 相同参数」重复调用，达到阈值即中断。",
    "最大步数按任务复杂度定，一般简单工具任务 5-8 步，复杂工作流 15-20 步，并记录步数分布持续调优。"
  ]},
  { cat: "Agent", q: "短期记忆和长期记忆怎么设计？上下文怎么压缩？", points: [
    "短期：保留最近若干轮 + 系统提示，必要时滚动摘要。",
    "长期：把关键事实与用户偏好抽取后存入向量库或数据库，按需召回。",
    "压缩策略：摘要历史、只保留实体与结论、按相关性筛选而不是全量拼接。"
  ]},
  { cat: "Agent", q: "什么时候用多智能体，什么时候明确不该用？", points: [
    "适合：任务可拆成明显不同的子角色、需要相互审查、子任务上下文差异大。",
    "不该用：任务简单、需要严格低延迟或低成本、状态共享复杂时。",
    "要能给出实测对比：多智能体常带来 2-3 倍 token 成本，必须有收益证明。"
  ]},
  { cat: "Agent", q: "怎么评测一个 Agent？指标怎么定？", points: [
    "端到端指标：任务成功率、平均步数、平均耗时、单任务成本、人工介入率。",
    "过程指标：工具选择正确率、参数正确率、无效调用率。",
    "用固定评测集重复运行，新增用例要沉淀进回归集，避免改动导致能力倒退。"
  ]},
  { cat: "RAG", q: "文档怎么切分？重叠多少？为什么？", points: [
    "按标题层级优先，其次递归切分，最后才用固定长度。",
    "经验值 300-800 token，重叠 10%-20%，防止关键句被切断。",
    "表格与代码块要特殊处理，不能简单按字数切；切分策略必须用评测集验证。"
  ]},
  { cat: "RAG", q: "向量检索召回不准，有哪些优化手段？", points: [
    "换更好的中文 Embedding 模型；优化切分粒度；加元数据过滤。",
    "引入 BM25 混合检索、Query Rewrite、HyDE 改写查询。",
    "加 Rerank 提升排序；扩大召回数量再精排；对多跳问题做子问题拆解。"
  ]},
  { cat: "RAG", q: "混合检索和 Rerank 分别解决什么问题？", points: [
    "混合检索解决「召回不到」：向量擅长语义，BM25 擅长关键词与专有名词。",
    "Rerank 解决「召回了但排序靠后」：交叉编码器精度更高，但慢，所以只对小候选集用。",
    "典型链路：两路各召回 20 条 → RRF 融合去重 → Rerank 取前 5 条。"
  ]},
  { cat: "RAG", q: "怎么评测 RAG？评测集怎么造？", points: [
    "指标：faithfulness、answer relevancy、context precision、context recall。",
    "评测集来源：从真实文档人工编写问答对，覆盖事实型、多跳、需拒答三类。",
    "每条要有标准答案与依据片段，规模 50 条起步，能自动化重复运行。"
  ]},
  { cat: "RAG", q: "怎么减少幻觉？无答案时怎么办？", points: [
    "强制基于检索内容回答并标注引用，禁止凭记忆补充。",
    "加相似度阈值与二次校验：检索结果与问题明显无关时直接拒答。",
    "Prompt 明确「资料中没有就回答不知道」，并把这个行为写进评测集验证。"
  ]},
  { cat: "工程", q: "并发请求下会话状态怎么隔离？", points: [
    "每个会话有唯一 session id，状态存 Redis 或数据库而不是进程内存。",
    "请求处理无状态化，才能横向扩容；并发写同一会话要用锁或版本号。",
    "注意多实例部署时本地内存缓存失效的问题。"
  ]},
  { cat: "工程", q: "工具调用失败、模型超时、接口限流怎么处理？", points: [
    "超时：设置单步与整体超时，超时后降级或返回部分结果。",
    "限流：指数退避重试 + 备用模型 + 请求排队。",
    "工具失败：把错误结构化返回给模型，多次失败后终止并给出明确提示，同时打日志告警。"
  ]},
  { cat: "工程", q: "怎么做可观测？Trace 里要看什么？", points: [
    "为每次请求生成 trace id，贯穿日志、模型调用、工具调用与数据库操作。",
    "看：每步输入输出、token 数与成本、耗时分布、工具调用成功率、错误类型。",
    "工具：Langfuse / Phoenix；线上要能按用户与会话回放一次完整执行链路。"
  ]},
  { cat: "工程", q: "Prompt 改了怎么保证不回退？Prompt 注入怎么防？", points: [
    "建立评测集并接入 CI，改动后自动跑，指标低于阈值就阻止合并。",
    "Prompt 版本化，记录每次改动的动机与指标变化，能回滚。",
    "注入防护：把用户输入与系统指令隔离、工具权限最小化、对输出做校验、高风险操作强制人工确认。"
  ]}
];

/* =========================================================
   原则与执行节奏
   ========================================================= */
const PRINCIPLES = [
  "不要等学完再动手：从第 1 周就开始写项目，边做边补。",
  "不要只做聊天机器人：会聊天不加分，会「办事」才是 Agent 岗位要的。",
  "不要忽略评测：能把效果量化的候选人极少，这是最快拉开差距的地方。",
  "不要忽略成本与延迟：真实业务一定会问「一次问答多少钱、几秒返回」。",
  "不要怕读英文文档：官方文档永远比二手教程准确，配合翻译工具即可。",
  "不要闭门造车：第 12 周开始就投递实习或初级岗，用面试反馈校准方向。",
  "不要只盯大厂：AI 应用初创、传统企业数字化部门、外包交付团队都缺 Agent 开发，先上岸再升级。",
  "英语与表达是加分项：能清楚讲架构和取舍，比多会一个框架更有用。"
];

const ROUTINE = {
  daily: [
    "30 分钟：学概念 + 用自己的话记笔记",
    "90 分钟：写代码，解决一个具体问题",
    "20 分钟：写 README / 提交 Git / 记录今天的坑"
  ],
  weekly: [
    "复盘本周产出，逐条对照验收标准",
    "更新 GitHub，把本周成果变成一条可展示的记录",
    "写 1 篇技术笔记，发布到掘金 / 知乎 / 个人博客，都是面试素材",
    "把下周任务拆成 5-8 个可勾选的小任务"
  ],
  check: [
    "如果仓库一周没有新 commit，说明进度停滞。",
    "能讲清「为什么这样设计」，比「我用了什么框架」重要 10 倍。",
    "只会跑 Demo 不算掌握，要能改造、排错、评测。"
  ]
};

const TIMEPLAN = [
  ["已有 Python / 后端经验", "3-4 个月", "跳过阶段 1，重点补 RAG 与评测"],
  ["有其他语言开发经验", "4-6 个月", "Python 用 2 周快速补，重点是异步与类型"],
  ["产品 / 项目岗转开发", "8-12 个月", "先补编程基础，把需求拆解与指标设计变成优势"],
  ["完全零基础", "6-9 个月", "严格按路线走，前 4 周不要跳，基础决定天花板"]
];

const SELFCHECK = [
  "我能用 Python 独立写出 300 行以上的结构化程序，并写测试",
  "我能用 FastAPI 搭一个带流式输出的 LLM 服务",
  "我能设计 3 个以上工具，并让 Agent 稳定调用",
  "我能搭一套带引用、带评测的 RAG 系统",
  "我能用 LangGraph 画出一个多步骤工作流并处理失败",
  "我能用 Docker 一键部署，并接入日志与 Trace",
  "我能说清每个技术选型的取舍与代价",
  "我有 3 个可展示的项目和 1 个线上 Demo",
  "我能用 10 分钟完整讲清一个项目的架构、指标与反思"
];
