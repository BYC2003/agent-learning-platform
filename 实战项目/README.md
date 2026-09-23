# 实战项目目录

这里放 8 个实战教程的代码，每个教程一个独立文件夹、独立 Git 仓库。

## 文件夹命名

```
t1-hello-agent       实战 01 环境标准化 + Git 工作流
t2-fastapi-llm       实战 02 FastAPI 流式 LLM 服务
t3-my-agent          实战 03 你的工具 Agent（参考仓库叫 t3-agents-sdk-ref）
t4-rag-kb            实战 04 企业级 RAG 知识库
t5-mcp-server        实战 05 MCP 工具服务器
t6-langgraph-flow    实战 06 LangGraph 工作流 + 人工审批
t7-browser-agent     实战 07 浏览器操作 Agent
t8-production        实战 08 上线工程化
```

## 每个项目的规矩

1. 一个项目一个虚拟环境（`.venv`），互不干扰。
2. 一个项目一个 GitHub 仓库，名字用英文小写加连字符。
3. 项目根目录必须有 `README.md`、`requirements.txt`、`.gitignore`。
4. 参考官方开源项目时，克隆到 `xxx-ref` 目录，**永远不改它**，自己的代码放在另外的目录。
5. 每完成一个功能就 commit 一次，提交信息用 `feat:` / `fix:` / `docs:` / `chore:` 开头。
6. `.env` 绝不提交；同时提供 `.env.example` 给别人做模板。

## 关于 git123 仓库

`BYC2003/git123` 建议用作「学习记录仓库」：放笔记、日志导出、踩坑记录。

三个旗舰作品（RAG 知识库、LangGraph 工作流、MCP 工具服务器）建议各自建独立仓库，名字用英文专业命名，方便放进简历。
