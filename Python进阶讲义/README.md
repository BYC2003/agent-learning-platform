# Python 进阶讲义（VS Code 练习版）

这份讲义对应学习清单中从“掌握文件读写与 try/except 异常处理”开始的内容。你已有 VS Code，因此全部练习都在 VS Code 中完成。

建议按顺序阅读：

0. [00：在 VS Code 中练习 Python](00-VSCode练习操作手册.md)
1. [02A：文件、异常、模块、类与 dataclass](02A-文件异常模块与面向对象.md)
2. [02B：类型校验、HTTP、异步、pytest 与 Git 冲突](02B-类型校验HTTP异步测试与Git.md)
3. [02C：三个入门项目逐项实现](02C-三个入门项目逐项实现.md)

第一天只做三件事：

1. 用 VS Code 打开 `E:\Project\0基础学agent`。
2. 读 00 手册的“打开项目、选择解释器、运行文件、调试、pytest”五节。
3. 在 `实战项目\python-foundation` 创建虚拟环境，跟着 02A 写 `exercises/01_io.py`。

统一练习约定：

- 每次先在 VS Code 资源管理器里新建文件。
- `Ctrl+S` 保存后再按 `Ctrl+F5` 运行。
- 出错时先读 VS Code 底部 `TERMINAL` 的 traceback。
- 用 `F9` 设置断点，`F5` 启动调试。
- 测试写进 `tests/test_*.py`，用 Testing 面板或 `python -m pytest -q`。
- 每完成一小节，在 Source Control 面板提交一次 Git。