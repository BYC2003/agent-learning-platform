/* =========================================================
   实战教程数据：8 个项目，从环境到企业级落地
   每个步骤都写清「在哪个软件操作 + 做什么 + 预期结果 + 踩坑」
   ========================================================= */

const TUTORIALS = [

/* ======================= T1 ======================= */
{
  id: "t1", no: "实战 01", level: "打基础", title: "环境标准化 + Git 工作流：把第一个项目推到你的仓库",
  time: "1-2 小时", repoName: "自建项目（先跑通 Git 流程）", repoUrl: "",
  goal: "用 VS Code + 终端搭出规范的项目骨架，并成功推送到你的 GitHub 仓库 git123。",
  deliverable: "一个能在别人电脑上复现的 Python 项目骨架，包含 README、依赖、.gitignore。",
  business: "企业里第一步就是让同事能一键跑起你的代码。这一步做标准，后面 7 个项目全部受益。",
  tags: ["Git", "VS Code", "venv", "工程习惯"],
  prereq: ["已安装 Git / VS Code / Python", "已登录 GitHub 账号"],
  steps: [
    { where: "文件资源管理器", title: "新建项目文件夹",
      do: ["打开 此电脑 → E 盘 → Project → 0基础学agent → 实战项目", "在「实战项目」里新建文件夹，命名为 t1-hello-agent"],
      expect: "完整路径为 E:\\Project\\0基础学agent\\实战项目\\t1-hello-agent",
      tip: "代码目录不要用中文名或空格，依赖和命令行工具偶尔会因此报错。" },
    { where: "VS Code", title: "用「打开文件夹」进入项目",
      do: ["打开 VS Code", "菜单栏 文件 → 打开文件夹…", "选中 t1-hello-agent，点「选择文件夹」", "如果弹出「是否信任此文件夹」，点「是，我信任」"],
      expect: "左侧资源管理器只显示 t1-hello-agent 一个文件夹",
      tip: "每个项目都用「打开文件夹」，不要只打开单个文件，否则终端和解释器路径会乱。" },
    { where: "VS Code 内置终端（Ctrl + 反引号）", title: "检查你的工具版本",
      do: ["确认终端左上角显示 PowerShell", "逐条执行右面的命令"],
      cmd: ["python --version", "git --version", "git config --global user.name", "git config --global user.email"],
      expect: "Python 3.10 以上、git 2.x，并显示你的用户名和邮箱",
      tip: "若最后两条没输出，执行 git config --global user.name \"你的名字\" 和 git config --global user.email \"你的邮箱\"。" },
    { where: "VS Code 终端", title: "创建并激活虚拟环境",
      do: ["在项目根目录执行右面两条命令", "激活成功后，命令提示符前面会出现 (.venv)"],
      cmd: ["python -m venv .venv", ".venv\\Scripts\\Activate.ps1"],
      expect: "命令行提示符变成 (.venv) PS E:\\...\\t1-hello-agent>",
      tip: "若提示「禁止运行脚本」，执行 Set-ExecutionPolicy -Scope CurrentUser RemoteSigned，输入 Y，再重新激活。" },
    { where: "VS Code 终端", title: "安装依赖",
      do: ["先升级 pip", "再装两个本项目要用的库"],
      cmd: ["python -m pip install --upgrade pip", "pip install python-dotenv httpx"],
      expect: "最后一行显示 Successfully installed ...",
      tip: "以后每装一次依赖，都跑一遍 pip freeze > requirements.txt，让别人能复现你的环境。" },
    { where: "VS Code 左侧资源管理器", title: "写第一个脚本 main.py",
      do: ["点资源管理器顶部的「新建文件」图标", "命名为 main.py", "粘贴右侧代码并按 Ctrl + S 保存"],
      code: `import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = os.getenv("APP_NAME", "我的第一个 Agent 练习项目")


def main() -> None:
    print(APP_NAME)
    if os.getenv("DEMO_KEY"):
        print("环境变量读取成功")
    else:
        print("提示：请在 .env 里配置 DEMO_KEY")


if __name__ == "__main__":
    main()`,
      expect: "左侧出现 main.py，编辑器里能看到代码高亮",
      tip: "注意 if __name__ == __main__ 这两行的下划线是两个，不是一整个长条。" },
    { where: "VS Code", title: "配置 .env 与 .gitignore",
      do: ["新建 .env，写入 DEMO_KEY=demo123", "新建 .env.example，写入 DEMO_KEY=在这里填你的值", "新建 .gitignore，写入右面三行"],
      code: `.venv/
__pycache__/
.env
*.pyc
.vscode/`,
      expect: ".env 在资源管理器里显示为灰色（已被忽略）",
      tip: "真实密钥永远只放 .env，而且 .env 必须写进 .gitignore。这是面试官会看的细节。" },
    { where: "VS Code 终端", title: "运行脚本",
      do: ["执行 python main.py"],
      cmd: ["python main.py"],
      expect: "终端打印：我的第一个 Agent 练习项目 / 环境变量读取成功",
      tip: "报 ModuleNotFoundError 说明虚拟环境没激活，或依赖没装成功。" },
    { where: "VS Code 终端", title: "初始化 Git 并提交",
      do: ["依次执行右面命令", "提交信息用英文前缀 + 中文说明，这是行业习惯"],
      cmd: ["git init", "git add .", "git commit -m \"chore: 初始化第一个 Agent 练习项目\"", "git branch -M main"],
      expect: "git log --oneline 能看到 1 条提交记录",
      tip: "如果误把 .env 提交了：git rm --cached .env 后再提交一次。" },
    { where: "浏览器 + VS Code 终端", title: "推送到你的 GitHub 仓库",
      do: ["浏览器打开 github.com/BYC2003/git123，确认仓库存在", "回到终端，关联远程仓库并推送"],
      cmd: ["git remote add origin https://github.com/BYC2003/git123.git", "git push -u origin main"],
      expect: "刷新 GitHub 页面，能看到 main.py、.gitignore、README.md，但看不到 .env",
      tip: "若先报 remote origin already exists：执行 git remote set-url origin https://github.com/BYC2003/git123.git。若仓库里已有文件，先 git pull --rebase origin main 再推送。" }
  ],
  check: ["虚拟环境创建并激活成功", "main.py 能正常运行并打印两行结果", ".env 没有被上传到 GitHub", "GitHub 仓库能看到本次提交", "requirements.txt 已生成"],
  errors: [
    ["Activate.ps1 无法加载，因为在此系统上禁止运行脚本", "执行 Set-ExecutionPolicy -Scope CurrentUser RemoteSigned 后输入 Y，重新激活虚拟环境"],
    ["fatal: remote origin already exists", "执行 git remote set-url origin https://github.com/BYC2003/git123.git"],
    ["Authentication failed 或一直要密码", "GitHub 已不支持密码登录：用 Personal Access Token 当密码，或用 Git Credential Manager 弹窗登录"],
    ["warning: LF will be replaced by CRLF", "只是换行符警告，不影响使用，可以直接忽略"]
  ],
  extend: ["把 main.py 改成接受命令行参数（用 argparse）", "为 main 函数写一个 pytest 测试", "给仓库加一张项目结构说明图"],
  next: "t2"
},

/* ======================= T2 ======================= */
{
  id: "t2", no: "实战 02", level: "必做", title: "第一个可上线的 LLM 服务：FastAPI + 流式输出",
  time: "4-6 小时", repoName: "自建项目", repoUrl: "",
  goal: "做一个带 /health、/chat、/chat/stream 三个接口的 LLM 服务，能边生成边返回，并统计成本。",
  deliverable: "可在浏览器 http://127.0.0.1:8000/docs 直接调试的 API 服务，README 含成本与延迟数据。",
  business: "企业内部问答入口、客服助手、工单摘要的第一层骨架，几乎每个 Agent 项目都从这个结构长出来。",
  tags: ["FastAPI", "SSE", "LLM API", "成本控制"],
  prereq: ["完成 T1", "有一个大模型 API Key（DeepSeek / 通义 / 智谱 / OpenAI 任选）"],
  steps: [
    { where: "文件资源管理器 + VS Code", title: "新建项目并打开",
      do: ["在 实战项目 下新建文件夹 t2-fastapi-llm", "VS Code → 文件 → 打开文件夹 → 选中它"],
      expect: "左侧资源管理器显示 t2-fastapi-llm",
      tip: "从这一步开始，每个教程都建立独立文件夹和独立虚拟环境，避免依赖互相污染。" },
    { where: "VS Code 终端", title: "建虚拟环境并安装依赖",
      do: ["创建并激活虚拟环境", "安装 Web 框架、ASGI 服务器、HTTP 客户端、配置库"],
      cmd: ["python -m venv .venv", ".venv\\Scripts\\Activate.ps1", "pip install \"fastapi[standard]\" uvicorn httpx python-dotenv pydantic"],
      expect: "命令行前缀出现 (.venv)，且安装成功",
      tip: "fastapi[standard] 会顺带装好 uvicorn 和命令行工具，省一步。" },
    { where: "VS Code 左侧资源管理器", title: "建立项目目录结构",
      do: ["在根目录新建文件夹 app", "在 app 里新建 __init__.py、config.py、llm.py、schemas.py、main.py 五个文件"],
      expect: "目录结构为 app/__init__.py、app/config.py、app/llm.py、app/schemas.py、app/main.py",
      tip: "分层是为了后面加数据库、加 RAG 时不用重写。企业项目都要求这种结构。" },
    { where: "VS Code", title: "写 .env 与 app/config.py",
      do: ["新建 .env，填入你的 Key 与接口地址", "把 config.py 写成右面这样：集中读取环境变量"],
      code: `import os
from dotenv import load_dotenv

load_dotenv()

LLM_API_KEY = os.getenv("LLM_API_KEY", "")
BASE_URL = os.getenv("BASE_URL", "https://api.deepseek.com/v1")
MODEL = os.getenv("MODEL", "deepseek-chat")
REQUEST_TIMEOUT = float(os.getenv("REQUEST_TIMEOUT", "60"))`,
      expect: "config.py 能 import 成功，不报错",
      tip: ".env 里写 LLM_API_KEY=sk-xxx、BASE_URL=https://api.deepseek.com/v1、MODEL=deepseek-chat。换成通义或 OpenAI 只需改这三行。" },
    { where: "VS Code", title: "写 app/llm.py：调用大模型并支持流式",
      do: ["粘贴右面代码", "这段代码用 OpenAI 兼容协议，几乎所有国内模型都能直接换 URL 使用"],
      code: `import json
from typing import AsyncIterator

import httpx

from .config import BASE_URL, MODEL, LLM_API_KEY, REQUEST_TIMEOUT


async def stream_chat(messages: list[dict]) -> AsyncIterator[str]:
    headers = {"Authorization": f"Bearer {LLM_API_KEY}"}
    payload = {"model": MODEL, "messages": messages, "stream": True}
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
        async with client.stream(
            "POST", f"{BASE_URL}/chat/completions", headers=headers, json=payload
        ) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:].strip()
                if data == "[DONE]":
                    break
                delta = json.loads(data)["choices"][0]["delta"].get("content")
                if delta:
                    yield delta`,
      expect: "文件没有语法错误提示",
      tip: "如果模型服务不兼容 stream 参数，把 stream 改成 False，改为一次性返回。" },
    { where: "VS Code", title: "写 app/main.py：三个接口",
      do: ["粘贴右面代码", "注意流式接口用 text/event-stream"],
      code: `import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .llm import stream_chat

app = FastAPI(title="我的第一个 LLM 服务")


class ChatRequest(BaseModel):
    message: str


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest) -> StreamingResponse:
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message 不能为空")

    async def event_gen():
        try:
            async for chunk in stream_chat([{"role": "user", "content": req.message}]):
                yield "data: " + json.dumps({"delta": chunk}, ensure_ascii=False) + "\\n\\n"
        except Exception as exc:
            yield "data: " + json.dumps({"error": str(exc)}, ensure_ascii=False) + "\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(event_gen(), media_type="text/event-stream")`,
      expect: "保存后无红色波浪线",
      tip: "SSE 的格式要求每条消息以两个换行结尾，少一个前端就收不到。" },
    { where: "VS Code 终端", title: "启动服务",
      do: ["执行右面命令", "保持这个终端开着，服务就在运行"],
      cmd: ["uvicorn app.main:app --reload --port 8000"],
      expect: "出现 Uvicorn running on http://127.0.0.1:8000",
      tip: "端口被占用就换 --port 8001。停止服务按 Ctrl + C。" },
    { where: "浏览器", title: "用自带文档页自测",
      do: ["浏览器打开 http://127.0.0.1:8000/docs", "先点 /health 的 Try it out → Execute，应返回 ok", "再点 /chat/stream 的 Try it out，输入一句话执行"],
      expect: "health 返回 {\"status\":\"ok\"}，stream 返回 data: {...} 形式的增量内容",
      tip: "浏览器文档页是企业开发的标准调试入口，面试时可以展示它。" },
    { where: "VS Code", title: "加上超时、重试与成本统计",
      do: ["在 llm.py 里把 httpx.Timeout 显式设置好", "在流式循环里累计输出字符数，估算 token 与费用", "把每次请求的耗时、token、费用打印成一行日志"],
      expect: "每调用一次，终端打印一行类似 cost log: tokens=512 耗时=3.2s 费用=0.002 元",
      tip: "真实业务一定会问「一次问答多少钱」，从第二个项目开始就养成统计习惯。" },
    { where: "VS Code 终端", title: "提交并推送到 GitHub",
      do: ["新建 README.md，写清依赖、启动命令、接口示例", "提交并推送（建议为这个项目单独建一个 GitHub 仓库）"],
      cmd: ["pip freeze > requirements.txt", "git add .", "git commit -m \"feat: 完成首个流式 LLM 服务\"", "git push"],
      expect: "GitHub 上能看到完整项目，README 里有启动命令",
      tip: "新建仓库时选 Public，简历里可以直接放链接。" }
  ],
  check: ["三个接口都能调通", "流式输出能看到逐字返回的效果", "有超时与异常处理", "README 里有成本与延迟数据", "GitHub 上能看到项目"],
  errors: [
    ["401 Unauthorized", "检查 .env 里的 LLM_API_KEY 是否正确、有没有多余空格"],
    ["404 或 model not found", "检查 MODEL 名称与 BASE_URL 是否匹配同一家服务商"],
    ["前端收到的中文是乱码或断成半个字", "SSE 统一用 json.dumps(..., ensure_ascii=False) 包装，别直接拼裸文本"],
    ["明明写了流式却一次性返回", "中间有无缓冲层（如某些代理），或没设置 media_type=text/event-stream"]
  ],
  extend: ["加 /chat 非流式接口，做对比", "加一个简单的 HTML 页面，用 EventSource 打字机效果显示", "把会话历史存进 SQLite，支持多轮对话"],
  next: "t3"
},

/* ======================= T3 ======================= */
{
  id: "t3", no: "实战 03", level: "必做", title: "复刻官方 Agent 框架：openai/openai-agents-python → 改造成你的工具 Agent",
  time: "6-8 小时", repoName: "openai/openai-agents-python", repoUrl: "https://github.com/openai/openai-agents-python",
  goal: "学会「复刻」的标准动作：克隆 → 跑通官方示例 → 读懂主循环 → 搬进自己的项目并加工具。",
  deliverable: "一个能调用 3 个自定义工具的 Agent（你亲自改造，不是原样复制），含 trace 日志。",
  business: "企业里不会让你从零写框架。能快速读懂并改造开源框架，是拿到 Agent 岗位的核心能力。",
  tags: ["Agent SDK", "Function Calling", "复刻", "ReAct"],
  prereq: ["完成 T2", "会使用 Git 克隆仓库"],
  steps: [
    { where: "VS Code 终端", title: "先克隆官方仓库做「参考实现」",
      do: ["进入实战项目目录", "克隆官方仓库，并起一个带 -ref 后缀的名字，表示这是参考代码"],
      cmd: ["cd E:\\Project\\0基础学agent\\实战项目", "git clone https://github.com/openai/openai-agents-python.git t3-agents-sdk-ref"],
      expect: "t3-agents-sdk-ref 文件夹出现，里面有 README.md 和 examples 目录",
      tip: "复刻第一原则：官方仓库只做参考，绝不在里面直接改代码，否则你以后无法同步上游更新。" },
    { where: "VS Code", title: "用 VS Code 打开官方仓库，先看目录",
      do: ["文件 → 打开文件夹 → 选择 t3-agents-sdk-ref", "重点看三个地方：README.md（怎么用）、examples/（怎么调）、src/ 或包目录（怎么实现的）"],
      expect: "你能说出这个框架的核心概念（Agent、Runner、Tool、Handoff）",
      tip: "读源码前先读 examples，比直接啃源码快 5 倍。" },
    { where: "VS Code 终端", title: "给参考仓库装依赖并跑通",
      do: ["在仓库根目录建虚拟环境", "以可编辑模式安装这个包本身"],
      cmd: ["python -m venv .venv", ".venv\\Scripts\\Activate.ps1", "pip install -e ."],
      expect: "安装成功，能 import agents 不报错",
      tip: "以 -e 方式安装后，改源码会立即生效，方便你边读边改着玩。" },
    { where: "VS Code", title: "配置模型 Key",
      do: ["把 .env.example 复制一份改名为 .env", "填入你的 API Key；若用国内模型，填 OpenAI 兼容的 BASE_URL"],
      expect: "示例代码能连上模型",
      tip: "很多示例默认用 OpenAI。用 DeepSeek 等国内模型时，需要设置 OPENAI_BASE_URL 与模型名。" },
    { where: "VS Code 终端", title: "运行官方最简示例",
      do: ["在 examples 目录里选一个最基础的示例文件（名字通常含 hello 或 basic）", "用 python 运行它"],
      cmd: ["python examples\\hello_world.py"],
      expect: "终端输出模型的回复内容",
      tip: "文件名以你看到实际文件为准：先在 examples 目录浏览，挑代码最短的那个。" },
    { where: "VS Code", title: "读主循环，回答三个问题",
      do: ["打开框架源码里负责运行 Agent 的文件（常见名字是 run.py 或 runner.py）", "在笔记里写下：(1) 一轮对话怎么开始 (2) 工具结果怎么回传给模型 (3) 什么时候循环结束"],
      expect: "你写下了三行自己的理解，而不是照抄代码",
      tip: "面试问到「Agent 循环怎么实现」，能说出这三点的候选人不到三成。" },
    { where: "文件资源管理器 + VS Code", title: "建立你自己的项目",
      do: ["在 实战项目 下新建 t3-my-agent 并单独 git init", "VS Code 打开它，建虚拟环境，安装 pip install openai-agents python-dotenv"],
      cmd: ["mkdir t3-my-agent", "cd t3-my-agent", "git init", "python -m venv .venv", ".venv\\Scripts\\Activate.ps1", "pip install openai-agents python-dotenv"],
      expect: "新的独立项目可以独立运行，不依赖参考仓库",
      tip: "参考仓库永远不动，你的改造全部发生在 t3-my-agent 里，这才是正确姿势。" },
    { where: "VS Code", title: "加三个自定义工具",
      do: ["工具 1：查询当前时间", "工具 2：读取指定目录下的 txt 文件内容（限制在你自己的文件夹）", "工具 3：SQLite 待办事项的增查（先只做只读与新增）"],
      expect: "Agent 面对「帮我记一条待办」时，会主动调用工具，而不是凭空回答",
      tip: "工具函数必须写清 docstring 和参数类型，模型靠这些信息决定调用哪个工具。" },
    { where: "VS Code", title: "加日志与最大步数保护",
      do: ["把每一轮的模型输出、工具名、参数、返回值打印或写入 logs/ 目录", "设置最大轮次（如 10），超过就中断并返回提示"],
      expect: "一次完整任务能回放出完整的调用链",
      tip: "没有最大步数保护的 Agent 在线上会因为死循环烧掉大量费用。" },
    { where: "VS Code 终端 + 浏览器", title: "跑 5 个真实任务并提交",
      do: ["设计 5 个需要调用不同工具的任务，全部跑一遍并记录结果", "写 README，然后推送到新建的 GitHub 仓库"],
      cmd: ["git add .", "git commit -m \"feat: 完成可调用三个工具的自定义 Agent\"", "git push"],
      expect: "5 个任务中至少 4 个成功完成",
      tip: "把这个成功率写进 README，这就是你简历上的第一个量化指标。" }
  ],
  check: ["能说清官方示例的完整调用链", "Agent 能正确选择 3 个工具", "有最大步数与日志", "5 个测试任务成功率不低于 80%", "参考仓库与自己的项目分离"],
  errors: [
    ["pip install -e . 报错缺少构建依赖", "先升级 pip：python -m pip install --upgrade pip setuptools wheel"],
    ["示例运行时报 API Key 未设置", "确认 .env 已创建且被程序加载；必要时把变量直接设在系统环境变量里"],
    ["模型不调用工具而是自己编答案", "检查工具描述是否清晰、参数是否用类型标注，必要时在系统提示里明确要求优先使用工具"],
    ["git clone 速度极慢或超时", "给 Git 配置代理，或改用 git clone --depth 1 只拉最新一次提交"]
  ],
  extend: ["加第 4 个工具：调用一个真实 HTTP API（天气或汇率）", "加人工确认：删除类操作必须先问用户同意", "把工具调用日志导出成 JSON，写一个简单的回放脚本"],
  next: "t4"
},

/* ======================= T4 ======================= */
{
  id: "t4", no: "实战 04", level: "核心", title: "企业级知识库 RAG：复刻 LlamaIndex 官方链路并升级到混合检索 + Rerank",
  time: "10-15 小时", repoName: "run-llama/llama_index + infiniflow/ragflow", repoUrl: "https://github.com/run-llama/llama_index",
  goal: "复刻一个能引用出处、并且能用数据证明效果的 RAG 系统。这是企业需求最大、面试问得最多的项目。",
  deliverable: "带引用回答的知识库问答系统 + 30 条评测集 + 纯向量 vs 混合检索的对比数据。",
  business: "制度问答、客服知识库、售后工单辅助、法务合同检索，全部是这套结构。",
  tags: ["RAG", "向量检索", "Rerank", "Ragas 评测"],
  prereq: ["完成 T2（会写 FastAPI）", "准备 3-5 份真实的 PDF 或 Markdown 文档"],
  steps: [
    { where: "文件资源管理器 + VS Code", title: "建项目并装依赖",
      do: ["新建 t4-rag-kb，VS Code 打开", "建虚拟环境并安装检索、向量库、PDF 解析相关依赖"],
      cmd: ["python -m venv .venv", ".venv\\Scripts\\Activate.ps1", "pip install llama-index llama-index-vector-stores-chroma chromadb pypdf rank-bm25 fastapi uvicorn python-dotenv"],
      expect: "安装完成，import llama_index 不报错",
      tip: "依赖较多，如果下载慢，加国内镜像：pip install -i https://pypi.tuna.tsinghua.edu.cn/simple ..." },
    { where: "文件资源管理器", title: "准备知识库文档",
      do: ["在项目里新建 data 目录", "放入 3-5 份真实文档（公司制度、产品手册、技术文档都可以）"],
      expect: "data 目录下有你的 PDF 或 .md 文件",
      tip: "不要用随便下载的英文论文，用自己的真实资料，面试时讲起来才有说服力。" },
    { where: "VS Code", title: "写 ingest.py：解析 → 切分 → 入库",
      do: ["加载 data 目录中的所有文档", "切分参数先用 chunk_size=800、overlap=100", "生成向量并持久化到 ./storage 目录"],
      code: `from pathlib import Path

from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Settings
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-zh-v1.5")
Settings.node_parser = SentenceSplitter(chunk_size=800, chunk_overlap=100)

documents = SimpleDirectoryReader(str(Path("data"))).load_data()
index = VectorStoreIndex.from_documents(documents)
index.storage_context.persist(persist_dir="./storage")
print("入库完成，文档数 =", len(documents))`,
      expect: "运行后 storage 目录生成索引文件",
      tip: "中文场景优先用中文 embedding（如 bge-small-zh、bge-m3），效果通常明显好于通用英文模型。" },
    { where: "VS Code 终端", title: "运行入库脚本",
      do: ["执行 python ingest.py", "观察是否打印 入库完成"],
      cmd: ["python ingest.py", "dir storage"],
      expect: "storage 目录里有索引文件，控制台无异常",
      tip: "以后文档更新只需重跑这个脚本。真实业务要做增量更新，这是你的扩展方向。" },
    { where: "VS Code", title: "写 query.py：检索 + 带引用回答",
      do: ["加载本地索引", "配置检索器（先 top_k=5）", "让模型只依据检索内容回答，并输出引用编号"],
      expect: "运行后能针对文档内容回答问题，并给出来源片段编号",
      tip: "在系统提示里写死一句：「资料中没有的信息就回答不知道」。这是减少幻觉最有效的一招。" },
    { where: "VS Code 终端", title: "用 5 个问题做第一次验收",
      do: ["准备 5 个只有你的文档里才有答案的问题", "全部跑一遍，记录哪些答对、哪些答错、哪些拒答"],
      cmd: ["python query.py"],
      expect: "至少 3 个问题答对，且引用来源正确",
      tip: "把错误案例记下来，它们就是你后面优化的依据，也是简历里「失败案例分析」的素材。" },
    { where: "VS Code", title: "加混合检索：BM25 + 向量",
      do: ["用 rank-bm25 对同一批文档建关键词索引", "两路各召回 20 条，用 RRF（倒数排名融合）合并去重"],
      expect: "专有名词、编号类问题（如「第三条」）的召回明显变好",
      tip: "向量擅长语义、BM25 擅长关键词。混合检索解决的是「压根没召回」的问题。" },
    { where: "VS Code", title: "加 Rerank 重排序",
      do: ["对融合后的候选集做重排序，取前 5 条交给模型", "用 bge-reranker 本地模型，或调用服务商提供的 rerank 接口"],
      expect: "正确答案的排名更靠前，回答质量提升",
      tip: "Rerank 解决的是「召回了但排在后面」。候选集别设太大，否则延迟和成本都会上升。" },
    { where: "VS Code", title: "加 FastAPI 接口",
      do: ["把 query.py 的逻辑包成 POST /ask 接口", "请求参数含 question，返回 answer + sources 数组"],
      expect: "http://127.0.0.1:8000/docs 能直接测试问答",
      tip: "sources 里至少要有文件名、片段文本、相似度分数，前端才能做出点击查看原文的效果。" },
    { where: "VS Code", title: "建 30 条评测集",
      do: ["新建 evalset.jsonl，每行一个 JSON：问题、标准答案、依据片段", "覆盖三类问题：事实型、需要跨片段的多跳问题、文档里没有答案的问题"],
      expect: "evalset.jsonl 有 30 行，用编辑器能正常解析",
      tip: "没有评测集，你的所有优化都是凭感觉，面试时无法证明效果。这是最容易被忽略、也最能拉开差距的一步。" },
    { where: "VS Code 终端", title: "用 Ragas 跑评测",
      do: ["安装 pip install ragas datasets", "写 eval.py 加载 evalset 并计算 faithfulness、answer relevancy、context precision、context recall"],
      cmd: ["pip install ragas datasets", "python eval.py"],
      expect: "输出四项指标的分数表",
      tip: "第一次的分数就是你的 baseline，务必记下来，后面所有优化都和它对比。" },
    { where: "VS Code 终端 + 浏览器", title: "做对比实验并推送到 GitHub",
      do: ["分别跑「纯向量」「混合检索」「混合 + Rerank」三种配置，把指标做成对比表", "写进 README，再推送到独立仓库"],
      cmd: ["git add .", "git commit -m \"feat: 完成带评测的混合检索知识库\"", "git push"],
      expect: "README 里有一张三行对比表，能看出每一步的收益",
      tip: "这张表就是你面试时最有说服力的东西：不是「我会 RAG」，而是「我把 recall 从 0.62 提到了 0.85」。" }
  ],
  check: ["能解析 PDF 并成功建库", "回答带引用来源", "无答案时会拒答", "有 30 条评测集与指标报告", "有纯向量 vs 混合检索的对比数据"],
  errors: [
    ["PDF 解析出来是乱码或空内容", "换 pypdf 的另一种提取模式，或先转成 Markdown 再入库；扫描件需要 OCR"],
    ["中文检索效果差", "把 embedding 换成中文模型（bge-small-zh 或 bge-m3），并重新入库"],
    ["回答里出现文档中没有的内容", "收紧系统提示、提高相似度阈值、加无答案拒答逻辑"],
    ["评测脚本报 token 超限", "减小 context 长度，或分批评测、加限流重试"]
  ],
  extend: ["做增量更新：新增文档只入库新片段，不重建全库", "给每条来源加相似度分数与页码，前端可跳转", "把 Chroma 换成 pgvector 或 Qdrant，写一篇选型对比"],
  next: "t5"
},

/* ======================= T5 ======================= */
{
  id: "t5", no: "实战 05", level: "前沿", title: "MCP 工具服务器：把内部系统接成大模型可调用的工具",
  time: "8-10 小时", repoName: "modelcontextprotocol/python-sdk", repoUrl: "https://github.com/modelcontextprotocol/python-sdk",
  goal: "复刻官方 SDK，写出自己的 MCP Server：一次开发，Claude Desktop、Cursor、VS Code、自建客户端都能用。",
  deliverable: "一个提供 3 个工具的 MCP Server，带权限边界说明与接入文档。",
  business: "企业内部系统（数据库、工单、CRM、文件）接入大模型的标准方式，2025 年后几乎所有 AI 应用团队都在做。",
  tags: ["MCP", "工具协议", "企业集成", "前沿"],
  prereq: ["完成 T3（理解工具调用）", "会读写 JSON 配置"],
  steps: [
    { where: "VS Code 终端", title: "建项目并安装官方 SDK",
      do: ["新建 t5-mcp-server，VS Code 打开，建虚拟环境", "安装官方 Python SDK（自带 CLI 与调试工具）"],
      cmd: ["mkdir t5-mcp-server", "cd t5-mcp-server", "python -m venv .venv", ".venv\\Scripts\\Activate.ps1", "pip install \"mcp[cli]\""],
      expect: "pip list 里能看到 mcp 包",
      tip: "官方仓库 github.com/modelcontextprotocol/python-sdk 里有 examples 目录，先扫一眼它提供哪些能力。" },
    { where: "VS Code", title: "先搞懂 MCP 提供什么",
      do: ["MCP 有三类能力：Tools（模型可调用）、Resources（只读数据）、Prompts（预设提示词）", "传输方式两种：stdio（本地进程，最常用）、HTTP/SSE（远程服务）"],
      expect: "你能用一句话解释：MCP 就是工具接入的 USB 接口",
      tip: "面试常问「MCP 和普通 Function Calling 有什么区别」，答案是：MCP 是标准协议，写一次能被多个客户端复用。" },
    { where: "VS Code", title: "写 server.py：定义三个工具",
      do: ["新建 server.py", "粘贴右面代码：时间查询、待办查询、文本统计", "每个函数都要有 docstring，模型靠它判断何时调用"],
      code: `import sqlite3
from datetime import datetime

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my-enterprise-tools")


@mcp.tool()
def current_time() -> str:
    """返回服务器当前时间。"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@mcp.tool()
def list_todos() -> list[dict]:
    """查询待办事项列表（只读）。"""
    conn = sqlite3.connect("todos.db")
    try:
        rows = conn.execute("select id, title, done from todos").fetchall()
    finally:
        conn.close()
    return [{"id": r[0], "title": r[1], "done": bool(r[2])} for r in rows]


@mcp.tool()
def word_count(text: str) -> dict:
    """统计一段文本的字符数与行数。"""
    return {"chars": len(text), "lines": len(text.splitlines())}


if __name__ == "__main__":
    mcp.run()`,
      expect: "保存后无语法错误",
      tip: "注意：stdio 模式下不要在工具里 print 调试信息，会破坏协议。要调试就写日志文件或用 stderr。" },
    { where: "文件资源管理器", title: "准备一个测试数据库",
      do: ["在项目目录建一个 SQLite 数据库并插入几行数据", "可以直接用 DB Browser for SQLite，或写一个 init_db.py"],
      expect: "项目目录出现 todos.db，里面有 2-3 条数据",
      tip: "真实企业里这里换成你自己的业务库，只读账号 + 视图，这是安全的基本做法。" },
    { where: "VS Code 终端", title: "用官方调试工具验证工具能被调用",
      do: ["执行右面命令，会打开 MCP Inspector 网页", "在网页里点 Tools → 选中 current_time → Run，看返回结果"],
      cmd: ["mcp dev server.py"],
      expect: "Inspector 页面能看到你定义的三个工具，并能成功调用",
      tip: "这一步先证明「协议层通了」，再去接客户端。排错时顺序很重要。" },
    { where: "Claude Desktop / Cursor / VS Code", title: "接入一个真实客户端",
      do: ["找到客户端的 MCP 配置（Claude Desktop 是 claude_desktop_config.json，Cursor 是 mcp.json）", "按右面格式加入你的 server，路径要写绝对路径"],
      code: `{
  "mcpServers": {
    "my-enterprise-tools": {
      "command": "E:\\\\Project\\\\0基础学agent\\\\实战项目\\\\t5-mcp-server\\\\.venv\\\\Scripts\\\\python.exe",
      "args": ["E:\\\\Project\\\\0基础学agent\\\\实战项目\\\\t5-mcp-server\\\\server.py"]
    }
  }
}`,
      expect: "重启客户端后，在工具列表里能看到 current_time 等工具",
      tip: "Windows 路径在 JSON 里必须把反斜杠写成两个，写错是最常见的失败原因。" },
    { where: "客户端对话框", title: "用自然语言触发工具",
      do: ["在客户端里问：现在服务器时间是多少？", "再问：帮我看看我的待办事项有哪些"],
      expect: "客户端会提示要调用工具，并在你同意后返回真实数据",
      tip: "客户端一般要求用户确认才调用工具，这正是 MCP 的安全设计，也是面试可以讲的点。" },
    { where: "VS Code", title: "加权限与安全边界",
      do: ["把所有写操作（新增、删除）单独标记，并要求调用前二次确认", "文件类工具限制在指定目录白名单内", "在 README 里写一张权限矩阵：工具名、是否只读、风险等级"],
      expect: "README 里有权限矩阵表格",
      tip: "企业最关心的是「Agent 会不会乱动我的数据」。能主动讲清权限边界的候选人非常少。" },
    { where: "VS Code 终端 + 浏览器", title: "写文档并推送",
      do: ["README 写清：怎么装、怎么配、能提供哪些工具、安全边界", "提交并推送到独立仓库"],
      cmd: ["git add .", "git commit -m \"feat: 完成 MCP 工具服务器与权限矩阵\"", "git push"],
      expect: "GitHub 上有完整说明，别人按文档能接上自己客户端",
      tip: "把这张权限矩阵截图放进简历附件或作品集，是很强的加分项。" }
  ],
  check: ["Inspector 能列出并调用你的工具", "至少接入一个真实客户端并调用成功", "有权限矩阵与安全说明", "README 有可复制的配置片段"],
  errors: [
    ["mcp dev 命令找不到", "确认装的是 mcp[cli]，并在已激活的虚拟环境里执行"],
    ["客户端里看不到工具", "检查 JSON 路径是否是绝对路径、反斜杠是否转义、客户端是否已完全重启"],
    ["工具调用时报 BrokenPipe 或协议错误", "工具函数里不要 print，把调试信息写进文件或用 logging 输出到 stderr"],
    ["SQLite 报 unable to open database file", "把数据库路径写成绝对路径，或确保工作目录正确"]
  ],
  extend: ["把 stdio 改成 HTTP/SSE 传输，让多人共用", "加一个需要审批的写工具，模拟真实企业流程", "用 Resources 暴露一份只读文件目录给模型"],
  next: "t6"
},

/* ======================= T6 ======================= */
{
  id: "t6", no: "实战 06", level: "核心", title: "LangGraph 工作流 + 人工审批：把 Agent 变成可控流程",
  time: "10-12 小时", repoName: "langchain-ai/langgraph", repoUrl: "https://github.com/langchain-ai/langgraph",
  goal: "复刻官方 StateGraph 示例，改造成带条件分支、断点持久化与人工审批的业务流程。",
  deliverable: "一个可中断、可恢复、带审批节点的审批流 Demo，含状态流转图。",
  business: "报销审批、合同流转、工单派发、报告生成，这是企业最愿意付费、也最容易验收的场景。",
  tags: ["LangGraph", "工作流", "Human-in-the-loop", "持久化"],
  prereq: ["完成 T3", "理解状态机的基本概念"],
  steps: [
    { where: "VS Code 终端", title: "建项目并安装依赖",
      do: ["新建 t6-langgraph-flow 并建虚拟环境", "安装 LangGraph、模型接入与 SQLite 持久化包"],
      cmd: ["mkdir t6-langgraph-flow", "cd t6-langgraph-flow", "python -m venv .venv", ".venv\\Scripts\\Activate.ps1", "pip install langgraph langchain-openai langgraph-checkpoint-sqlite python-dotenv"],
      expect: "安装成功，import langgraph 不报错",
      tip: "官方仓库 examples 目录里有大量可直接复刻的图，先挑最简单的 quickstart。" },
    { where: "VS Code", title: "先复刻一个最简 StateGraph",
      do: ["定义 State（TypedDict）", "定义两个节点函数", "用 START → node_a → node_b → END 连起来并运行"],
      code: `from typing import TypedDict

from langgraph.graph import StateGraph, START, END


class State(TypedDict):
    text: str
    length: int


def add_text(state: State) -> State:
    return {"text": state["text"] + " —— 已处理"}


def count(state: State) -> State:
    return {"length": len(state["text"])}


builder = StateGraph(State)
builder.add_node("add_text", add_text)
builder.add_node("count", count)
builder.add_edge(START, "add_text")
builder.add_edge("add_text", "count")
builder.add_edge("count", END)

graph = builder.compile()
print(graph.invoke({"text": "报销申请 3200 元", "length": 0}))`,
      expect: "终端打印处理后的文本与长度",
      tip: "先跑通最简图，再往业务上改。别一上来就写复杂流程。" },
    { where: "VS Code", title: "把场景换成审批流程",
      do: ["把 State 改成业务字段：申请内容、金额、风险等级、决策、审批意见", "节点 1 解析申请（抽取金额与类型）", "节点 2 判断金额与风险"],
      expect: "输入一段报销描述，能输出解析后的结构化字段",
      tip: "解析节点建议用模型 + 结构化输出（Pydantic），比正则稳得多。" },
    { where: "VS Code", title: "加条件路由",
      do: ["金额小于 1000 且无风险 → 自动通过", "金额大于等于 1000 或高风险 → 走人工审批节点"],
      expect: "同一个流程，不同输入会自动走不同分支",
      tip: "langgraph 里用 add_conditional_edges 实现分支，这就是它的核心价值。" },
    { where: "VS Code", title: "加持久化，让流程能暂停后继续",
      do: ["用 SqliteSaver 作为 checkpointer", "compile(checkpointer=saver)", "调用时传入 thread_id 作为会话标识"],
      expect: "同一个 thread_id 能查到上一次的状态",
      tip: "thread_id 概念很重要：它就是业务流程的「单号」。" },
    { where: "VS Code", title: "加人工审批（Human-in-the-loop）",
      do: ["在人工审批节点前用 interrupt 暂停", "人工给出 approve / reject 后，用 Command(resume=...) 继续执行"],
      expect: "程序能停在审批点，并在收到人工输入后继续跑完",
      tip: "这是 Agent 走向生产的关键：高风险动作必须能停下来等人确认。" },
    { where: "VS Code", title: "加日志与状态流转记录",
      do: ["每进入一个节点就记录：节点名、输入摘要、输出摘要、耗时", "把记录写入日志文件或 SQLite"],
      expect: "一次申请能回放出完整的流转路径",
      tip: "面试时打开这份日志讲流程，比空讲概念有说服力得多。" },
    { where: "VS Code", title: "包一个接口或命令行入口",
      do: ["写 run.py 接收申请文本并触发流程", "若已经熟悉 FastAPI，可直接提供 POST /apply 与 POST /approve 两个接口"],
      expect: "能通过命令或接口完整跑一遍「提交 → 暂停 → 审批 → 完成」",
      tip: "做到这一步，你的项目已经具备企业 Demo 的形态。" },
    { where: "VS Code", title: "画状态流转图",
      do: ["用 mermaid 语法把节点和分支写进 README", "标注每个节点的输入输出与条件"],
      expect: "GitHub 上能直接渲染出流程图",
      tip: "LangGraph 可以 print graph.get_graph().draw_mermaid() 直接导出，不用手画。" },
    { where: "VS Code 终端 + 浏览器", title: "测试与提交",
      do: ["准备 6 个测试案例：小额自动通过、大额人工通过、大额人工拒绝、高风险、字段缺失、重复提交", "全部跑通后提交推送"],
      cmd: ["git add .", "git commit -m \"feat: 完成带人工审批的 LangGraph 工作流\"", "git push"],
      expect: "6 个案例行为符合预期，README 有流程图与案例表",
      tip: "把「人工介入率」「自动通过率」写进 README，这就是业务流程的量化指标。" }
  ],
  check: ["最简 StateGraph 能跑通", "条件分支按规则正确路由", "中断后能用同一个 thread_id 恢复", "有人工审批节点", "README 有流程图与测试案例表"],
  errors: [
    ["把 State 写成普通 dict 导致字段丢失", "用 TypedDict 明确定义字段；需要累加时用 Annotated + reducer"],
    ["checkpointer 报线程相关错误", "确认异步环境用的是 AsyncSqliteSaver，且调用时传了 config={\"configurable\": {\"thread_id\": ...}}"],
    ["interrupt 之后无法继续", "恢复时必须用 Command(resume=...) 并带上同一个 thread_id"],
    ["流程图显示乱码", "把 mermaid 代码放进 README 的代码块，语言标记写成 mermaid"]
  ],
  extend: ["把 SQLite 换成 Postgres，支持多实例部署", "加超时节点：审批超过 24 小时自动升级给上级", "把结果同时推送到企业微信或飞书机器人"],
  next: "t7"
},

/* ======================= T7 ======================= */
{
  id: "t7", no: "实战 07", level: "前沿", title: "浏览器操作 Agent：复刻 browser-use，让 AI 自己点网页",
  time: "8-10 小时", repoName: "browser-use/browser-use", repoUrl: "https://github.com/browser-use/browser-use",
  goal: "复刻浏览器 Agent 的开源实现，把任务收窄到一个稳定可复现的场景，并加上沙箱安全边界。",
  deliverable: "一个能在指定网站完成多步操作并导出结果的 Agent，带失败截图与重试策略。",
  business: "传统 RPA 的升级替代：网页填报、数据采集、后台批处理。企业最爱问「它会不会乱点」，所以安全设计是重点。",
  tags: ["浏览器 Agent", "Computer Use", "RPA", "沙箱"],
  prereq: ["完成 T3（工具调用）", "准备一个可用于测试的账号或公开网站"],
  steps: [
    { where: "VS Code 终端", title: "建项目并安装浏览器自动化依赖",
      do: ["新建 t7-browser-agent 并建虚拟环境", "安装 browser-use，再下载 Chromium 浏览器内核"],
      cmd: ["mkdir t7-browser-agent", "cd t7-browser-agent", "python -m venv .venv", ".venv\\Scripts\\Activate.ps1", "pip install browser-use playwright", "playwright install chromium"],
      expect: "python -c \"import browser_use\" 不报错，Chromium 下载完成",
      tip: "playwright install 要下载几百 MB，网络慢是正常的；失败就重试或配置镜像。" },
    { where: "VS Code", title: "先跑通官方最简示例",
      do: ["打开官方仓库 README，找到最短的一段示例代码", "复制到 main.py，配置模型 Key，运行一次"],
      expect: "自动弹出一个浏览器窗口，Agent 自己打开网页并执行任务",
      tip: "第一次跑一定只看它能不能动起来，不要急着改场景。" },
    { where: "VS Code", title: "把任务收窄成一个真实场景",
      do: ["选一个公开、允许访问的页面（例如某个公开榜单或信息页）", "写清任务：打开页面 → 找到前 10 条 → 提取标题与链接 → 保存 CSV"],
      expect: "Agent 能稳定完成这个窄任务",
      tip: "浏览器 Agent 在开放任务上成功率很低。先做窄场景，成功率才上得去，也才好写进简历。" },
    { where: "VS Code", title: "加安全边界（这一步最重要）",
      do: ["域名白名单：只允许访问你指定的网站，其他一律拒绝", "默认只读：禁止自动点击支付、提交、删除类按钮", "单步与整体超时：超过就强制结束"],
      expect: "访问白名单以外的站点时程序会主动拒绝执行",
      tip: "企业落地时，这段白名单代码比你 Agent 有多聪明更重要。面试请重点讲这里。" },
    { where: "VS Code", title: "加失败截图与重试",
      do: ["每一步失败时自动保存截图到 screenshots/ 目录", "对可恢复的错误（元素没加载出来）做 2 次重试"],
      expect: "失败时 screenshots 里有图片，能看出当时页面长什么样",
      tip: "这是排障刚需。没有截图，线上失败你根本不知道发生了什么。" },
    { where: "VS Code", title: "加步骤日志与结果导出",
      do: ["记录每一步的思考、动作、页面地址与耗时", "把最终抓取结果写成 results.csv 或 JSON"],
      expect: "一次执行结束后有完整日志与结构化结果文件",
      tip: "把日志设计成能回放的形式，这正是可观测性思维。" },
    { where: "VS Code", title: "控制成本与耗时",
      do: ["限制最大步数（如 15 步）", "能用 DOM 文本解决的就不要走视觉模型，视觉 token 很贵"],
      expect: "单次任务耗时与费用都有记录",
      tip: "浏览器 Agent 用视觉模型时一次任务可能花几块钱，务必先算账再做。" },
    { where: "VS Code", title: "做 10 次稳定性测试",
      do: ["同一个任务重复跑 10 次，记录成功次数", "分析失败原因：页面变化、加载慢、元素定位失败"],
      expect: "成功率至少 60%，并在 README 里如实写出失败原因",
      tip: "如实写出限制比吹嘘成功率更让面试官信任。" },
    { where: "VS Code 终端 + 浏览器", title: "写文档并推送",
      do: ["README 写清：能做什么、安全边界、成功率、已知限制", "提交并推送到独立仓库"],
      cmd: ["git add .", "git commit -m \"feat: 完成带白名单的浏览器操作 Agent\"", "git push"],
      expect: "GitHub 上有演示 GIF 或截图（强烈建议加上）",
      tip: "浏览器 Agent 的演示视频在简历里非常抓眼球，花 20 分钟录一个。" }
  ],
  check: ["官方示例能跑通", "窄场景任务能稳定完成", "有域名白名单与只读模式", "失败时有截图与重试", "README 写清成功率与限制"],
  errors: [
    ["playwright install 下载失败", "配置国内镜像或重试；也可先只安装 chromium，不装全部浏览器"],
    ["Agent 打开页面但一直找不到元素", "把任务描述写得更具体，或改用更稳定的选择器与固定入口 URL"],
    ["每次运行结果都不一样", "页面有动态内容。记录页面快照，降级为固定字段抓取，或给页面加等待条件"],
    ["费用异常高", "限制步数、减少视觉模型使用、把任务拆成更小的确定性步骤"]
  ],
  extend: ["把结果直接写入数据库或发送到飞书/企业微信", "加人工接管：Agent 卡住时暂停并等待人工操作", "对比 browser-use 与直接调用 HTTP 接口两种方案的成本"]
},

/* ======================= T8 ======================= */
{
  id: "t8", no: "实战 08", level: "必做", title: "上线工程化：Docker 部署 + Langfuse 可观测 + 评测接入 CI",
  time: "10-12 小时", repoName: "langfuse/langfuse + promptfoo/promptfoo", repoUrl: "https://github.com/langfuse/langfuse",
  goal: "把前面某个项目从「我电脑上能跑」变成「一条命令部署、有监控、有评测、改动不回退」的工程。",
  deliverable: "docker compose 一键启动的项目，含 Trace 面板、评测报告与 GitHub Actions 流水线。",
  business: "这是初级与合格工程师的分界线。企业招人最怕的就是「Demo 很好看，上线就崩」。",
  tags: ["Docker", "可观测", "评测", "CI/CD"],
  prereq: ["完成 T4 或 T6（拿一个已有项目来改造）", "了解基本的命令行操作"],
  steps: [
    { where: "文件资源管理器 + VS Code", title: "选定要上线的项目",
      do: ["建议用 T4 的知识库项目（有依赖、有数据、有评测，最像真实服务）", "在 VS Code 里打开它，确认本地还能正常运行"],
      expect: "项目能跑起来，作为本次改造的基线",
      tip: "改造前先 git commit 一次，方便随时回退。" },
    { where: "VS Code", title: "写 Dockerfile",
      do: ["在项目根目录新建 Dockerfile", "粘贴右面内容：基于 slim 镜像，先装依赖再拷代码，充分利用缓存"],
      code: `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      expect: "文件保存成功",
      tip: "先 COPY requirements.txt 再装依赖，这样改代码不会导致每次重新装包。" },
    { where: "VS Code", title: "写 docker-compose.yml 把依赖服务一起管起来",
      do: ["新建 docker-compose.yml", "把应用和向量库（或数据库）编排到一起"],
      code: `services:
  app:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:`,
      expect: "两个服务都写好了",
      tip: "dependencies 不要写死版本 latest 到生产；学习阶段用 latest 没问题，面试时要能说出为什么要锁版本。" },
    { where: "VS Code", title: "补上配置模板与忽略规则",
      do: ["把 .env 里所有变量整理成 .env.example（不含真实值）", "确认 .dockerignore 或 .gitignore 里排除了 .venv、.env、storage 等大目录"],
      expect: ".env.example 里每一项都有注释说明",
      tip: "别人 clone 之后应该只看 .env.example 就知道要配什么。" },
    { where: "终端（PowerShell）", title: "用 Docker 启动整套服务",
      do: ["确认 Docker Desktop 已启动", "在项目根目录执行右面命令"],
      cmd: ["docker compose up --build", "docker compose ps"],
      expect: "两个容器都是 running，浏览器访问 http://127.0.0.1:8000/docs 能打开",
      tip: "报端口占用就改端口；报找不到 Docker 就先启动 Docker Desktop 并等它就绪。" },
    { where: "浏览器 + VS Code", title: "接入 Langfuse，让每次调用都能被追踪",
      do: ["用 Docker 起一个 Langfuse，或注册它的云服务免费版", "在代码里加上 tracing：记录每次请求的输入、输出、token、耗时"],
      expect: "Langfuse 面板里能看到每次问答的完整链路",
      tip: "要求自己做到：线上任何一次回答，都能查到它用了哪些检索片段、花了多少钱。" },
    { where: "VS Code", title: "写 promptfoo 评测配置",
      do: ["安装 npm i -g promptfoo，或使用 npx", "新建 promptfooconfig.yaml 与 prompts/qa.txt", "配置 20 条测试用例与断言"],
      code: `prompts:
  - file://prompts/qa.txt

providers:
  - id: openai:gpt-4o-mini
    config:
      temperature: 0

tests:
  - vars:
      question: 请假流程是什么？
    assert:
      - type: contains
        value: 请假
  - vars:
      question: 报销上限是多少？
    assert:
      - type: llm-rubric
        value: 回答里必须包含具体金额上限`,
      expect: "执行 npx promptfoo eval 能看到通过率表格",
      tip: "断言不一定要用模型打分，先用 contains 这类确定性断言，又快又稳。" },
    { where: "VS Code 终端", title: "跑一次完整评测并记录基线",
      do: ["执行评测命令", "把通过率写进 README，作为以后改 Prompt 的对照基线"],
      cmd: ["npx promptfoo eval", "npx promptfoo view"],
      expect: "浏览器打开评测报告页，能看到每条用例的通过情况",
      tip: "以后每次改 Prompt 都跑一遍，指标掉了就知道改坏了，这就是回归测试。" },
    { where: "VS Code", title: "接入 GitHub Actions 自动跑测试",
      do: ["在项目里新建 .github/workflows/ci.yml", "粘贴右面内容，实现 push 后自动装依赖并跑测试"],
      code: `name: ci

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: 安装依赖
        run: pip install -r requirements.txt
      - name: 运行测试
        run: pytest -q`,
      expect: "推送到 GitHub 后，仓库的 Actions 页面出现绿色对勾",
      tip: "有测试用例才跑得动 CI。没有测试就先补 3 个最简单的：健康检查、空输入、正常输入。" },
    { where: "VS Code", title: "加健康检查与结构化日志",
      do: ["提供 /health 接口返回服务与依赖状态", "日志统一格式：时间、trace_id、用户、耗时、token、费用"],
      expect: "容器健康检查通过，日志能按 trace_id 串起一次完整请求",
      tip: "结构化日志（输出 JSON）才好被日志系统检索，这是运维要求。" },
    { where: "浏览器", title: "（可选）部署到云服务器",
      do: ["买一台最低配的云服务器（2 核 4G 起）", "装 Docker，把代码拉上去，执行 docker compose up -d", "用域名或公网 IP 访问"],
      expect: "从公网能访问你的服务",
      tip: "有公网 Demo 链接的候选人，面试通过率明显更高。记得配置防火墙只开必要端口。" },
    { where: "VS Code 终端 + 浏览器", title: "更新 README 并推送",
      do: ["README 补上：架构图、部署方式、评测结果、成本数据、已知限制", "提交推送，确认 CI 通过"],
      cmd: ["git add .", "git commit -m \"feat: 容器化部署并接入可观测与评测流水线\"", "git push"],
      expect: "GitHub 页面有架构图、评测表格与绿色 CI 徽章",
      tip: "把 CI 徽章贴到 README 顶部，这是很专业的细节。" }
  ],
  check: ["docker compose up 能一条命令启动", "/health 返回正常", "Langfuse 里能看到完整 trace", "promptfoo 评测能跑出通过率", "GitHub Actions 自动跑测试"],
  errors: [
    ["docker compose 启动后应用立刻退出", "用 docker compose logs app 看日志，常见原因是 .env 没配或依赖服务还没就绪"],
    ["容器里连不上本机的向量库", "容器间用服务名通信（如 http://qdrant:6333），不能用 127.0.0.1"],
    ["GitHub Actions 里评测失败", "密钥要放到仓库 Settings → Secrets，配置成环境变量注入，不能写在代码里"],
    ["镜像体积过大构建很慢", "加 .dockerignore，排除 .venv、storage、data、日志目录"]
  ],
  extend: ["加 Nginx 反向代理与 HTTPS", "给评测加阈值：低于 80% 直接让 CI 失败", "加成本日报：每天统计 token 与费用并输出报表"]
}
];

/* =========================================================
   复刻方法论：如何复刻任何一个开源项目
   ========================================================= */
const REPLICATION = {
  title: "复刻任何开源项目的六步法",
  subtitle: "不要 clone 完就跑，跑通只是第 3 步。真正的复刻是「看懂它为什么这么设计，然后换成你的场景」。",
  steps: [
    { n: 1, name: "看", text: "先读 README 与目录结构，搞清楚它能解决什么问题、需要什么前置条件。别急着 clone。", time: "20 分钟" },
    { n: 2, name: "跑", text: "单独建一个 -ref 参考目录 clone 下来，独立虚拟环境，把官方最简示例原样跑通。", time: "1 小时" },
    { n: 3, name: "验", text: "跑通后立刻做一件事：改一个小参数或换一句话，确认你知道每一行在干什么。", time: "30 分钟" },
    { n: 4, name: "拆", text: "挑出核心文件读懂主流程（通常是 run/graph/agent 这类文件），用三句话写下它的工作流程。", time: "2 小时" },
    { n: 5, name: "搬", text: "新建一个属于你自己的项目，把最小可用部分搬进去，不要直接改参考仓库。", time: "1 小时" },
    { n: 6, name: "改", text: "换成你的场景：换数据、换工具、换流程，加上日志、错误处理与评测，最后写成自己的 README。", time: "半天到两天" }
  ],
  rules: [
    "参考目录用 -ref 结尾，永远不修改它，方便随时对照上游。",
    "每复刻一个项目，都要写一篇 500 字笔记：它解决什么问题、核心抽象是什么、我踩了什么坑。",
    "复刻不是抄。跑通官方示例只算入门，能换场景并加上量化指标才算掌握。",
    "遇到看不懂的代码，先跑起来加打印，再去看文档，最后才读源码。",
    "每复刻完一个，就在 GitHub 上留一条记录，面试时这就是你的学习证据链。"
  ]
};

/* =========================================================
   企业落地项目地图：什么方向真的有人付钱
   ========================================================= */
const BUSINESS = [
  { scene: "企业知识库问答", demand: "极高", stack: "RAG + 混合检索 + Rerank + 引用溯源", roi: "新员工上手时间下降，客服重复问题减少", project: "T4" },
  { scene: "内部系统接入（数据库/工单/CRM）", demand: "极高", stack: "MCP + 工具权限分级", roi: "一次开发多客户端复用，人工查数据时间下降", project: "T5" },
  { scene: "审批与流程自动化", demand: "高", stack: "LangGraph + 人工审批 + 状态持久化", roi: "流程耗时下降，可追溯、可审计", project: "T6" },
  { scene: "网页数据采集与填报", demand: "高", stack: "浏览器 Agent + 白名单 + 截图留痕", roi: "替代重复人工操作，传统 RPA 升级", project: "T7" },
  { scene: "AI 应用上线与质量保障", demand: "高", stack: "Docker + Langfuse + promptfoo + CI", roi: "质量可量化、成本可控、改动不回退", project: "T8" },
  { scene: "智能客服与工单辅助", demand: "高", stack: "RAG + 工具调用 + 人工接管", roi: "一线响应速度提升，可统计解决率", project: "T4 + T3" },
  { scene: "报告与研报自动生成", demand: "中高", stack: "工作流编排 + 检索 + 引用", roi: "初稿时间从数小时降到分钟级", project: "T6" }
];

/* =========================================================
   18 周执行计划（按你的基础定制）
   ========================================================= */
const PLAN18 = [
  { week: "第 1 周", focus: "标准化 + 补短板", detail: "做 T1；补三件事：类型注解与 pydantic、pytest、async/await", output: "t1 仓库 + 一份 requirements.txt" },
  { week: "第 2 周", focus: "LLM 应用骨架", detail: "T2 前半：项目结构、调用模型、流式输出", output: "能逐字返回的接口" },
  { week: "第 3 周", focus: "结构化与成本", detail: "T2 后半：结构化输出、错误处理、成本与延迟统计", output: "t2 仓库 + 成本延迟报告" },
  { week: "第 4 周", focus: "复刻官方 SDK", detail: "T3：克隆官方仓库跑通示例，读主循环", output: "参考笔记 + 跑通记录" },
  { week: "第 5 周", focus: "改造成自己的 Agent", detail: "T3 收尾：3 个自定义工具、最大步数、5 任务测试；手写一次 ReAct 循环", output: "t3 仓库 + 成功率" },
  { week: "第 6 周", focus: "RAG 基础链路", detail: "T4：文档解析、切分、向量化入库", output: "能检索到正确片段" },
  { week: "第 7 周", focus: "带引用回答", detail: "T4：拼上下文、引用编号、无答案拒答", output: "可问答的知识库" },
  { week: "第 8 周", focus: "检索升级 + 评测", detail: "T4：混合检索、Rerank、30 条评测集、对比实验", output: "t4 仓库 + 指标对比表" },
  { week: "第 9 周", focus: "MCP 协议入门", detail: "T5：写 MCP Server，用 Inspector 调通三个工具", output: "可被调用的工具服务" },
  { week: "第 10 周", focus: "接入与安全", detail: "T5：接入真实客户端、写权限矩阵与文档", output: "t5 仓库 + 权限矩阵" },
  { week: "第 11 周", focus: "工作流编排", detail: "T6：StateGraph、条件路由、SQLite 持久化", output: "能分支的业务流程" },
  { week: "第 12 周", focus: "人工审批", detail: "T6：interrupt 审批、6 个测试案例、状态流转图", output: "t6 仓库 + 流程图" },
  { week: "第 13 周", focus: "浏览器 Agent", detail: "T7：窄场景任务、白名单、失败截图、10 次稳定性测试", output: "t7 仓库 + 演示视频" },
  { week: "第 14 周", focus: "容器化", detail: "T8：Dockerfile、docker compose 一键启动", output: "一条命令跑起来" },
  { week: "第 15 周", focus: "可观测与 CI", detail: "T8：Langfuse trace、promptfoo 评测、GitHub Actions", output: "t8 上线 + 绿色 CI" },
  { week: "第 16 周", focus: "评测与性能专项", detail: "深入 Ragas 指标、成本优化、并发压测；开始刷面试题 1-10", output: "优化报告" },
  { week: "第 17 周", focus: "作品集打磨", detail: "3 个旗舰项目补齐 README、架构图、演示视频；刷面试题 11-20", output: "3 个可展示作品" },
  { week: "第 18 周", focus: "求职冲刺", detail: "简历改写、模拟面试、按 JD 对照补齐、开始投递", output: "投递表 + 面试复盘" }
];
