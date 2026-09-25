# 00：在 VS Code 中练习 Python

> 你的环境：Windows、VS Code 1.139.0、Python 3.10.9、Git 2.55.0。
>
> 这一册不讲 Python 语法，只讲“在 VS Code 里怎么打开项目、写文件、运行、调试、测试和提交 Git”。先把操作流程学会，后面 02A、02B、02C 都按这套方式练。

---

# 一、先认识 VS Code 界面

打开 VS Code 后，左侧竖条叫“活动栏”，从上到下最常用的是：

| 图标 | 名称 | 快捷键 | 用途 |
|---|---|---|---|
| 两张纸 | 资源管理器 Explorer | `Ctrl+Shift+E` | 新建、重命名、打开文件 |
| 放大镜 | 搜索 Search | `Ctrl+Shift+F` | 在整个项目中查找文字 |
| 分支图标 | 源代码管理 Source Control | `Ctrl+Shift+G` | 查看改动、提交、分支 |
| 三角加虫子 | 运行和调试 Run and Debug | `Ctrl+Shift+D` | 运行、断点、查看变量 |
| 方块 | 扩展 Extensions | `Ctrl+Shift+X` | 安装 Python 插件 |
| 底部圆点 | 测试 Testing | 点击打开 | 运行 pytest |

中间是编辑区，底部是终端（Terminal）。

## 最常用的快捷键

| 快捷键 | 作用 |
|---|---|
| `Ctrl+S` | 保存当前文件 |
| Ctrl + 反引号 | 打开或关闭底部终端 |
| `Ctrl+Shift+P` | 打开命令面板，输入命令 |
| `Ctrl+P` | 按文件名快速打开 |
| `Ctrl+Shift+E` | 切到资源管理器 |
| `Ctrl+F5` | 不调试，直接运行当前 Python 文件 |
| `F5` | 启动调试 |
| `Shift+F5` | 停止调试 |
| `F9` | 在当前行设置或取消断点 |
| `F10` | 调试时单步执行，不进入函数 |
| `F11` | 调试时进入函数 |
| `Shift+Alt+F` | 格式化当前文件 |

这里说的反引号键在键盘数字 `1` 左边，通常和 `~` 是同一个键。

---

# 二、安装必要的扩展

1. 点击左侧“扩展”图标，或按 `Ctrl+Shift+X`。
2. 搜索并安装 Microsoft 官方的 **Python** 扩展。发布者通常是 `Microsoft`。
3. 搜索 **Pylance**。通常安装 Python 扩展后会一起安装，没有就单独安装。
4. 可选：搜索 **Ruff**，安装 `charliermarsh.ruff`，用于格式化和检查代码。
5. 可选：搜索 **GitLens**，用于查看 Git 历史，不是必需。

只需要 Python 扩展就能完成全部练习。扩展越多不一定越好，初学先装 Python、Pylance、Ruff 即可。

---

# 三、用 VS Code 打开练习项目

不要只打开单个 `.py` 文件，应该打开整个项目文件夹，否则模块导入、venv、pytest 都容易识别错误。

## 1. 打开项目根目录

推荐先打开平台根目录：

```text
E:\Project\0基础学agent
```

方法一：菜单栏 -> **文件（File）** -> **打开文件夹（Open Folder）** -> 选择 `E:\Project\0基础学agent`。

方法二：在平台目录打开终端，执行：

```powershell
code .
```

方法三：在 VS Code 中按 `Ctrl+K`，松开后再按 `Ctrl+O`。

首次打开时如果提示“是否信任此文件夹作者”，选择信任。否则 Python、测试和调试扩展可能受限。

## 2. 创建练习目录

在左侧资源管理器中：

1. 找到 `实战项目` 文件夹。
2. 在它上面右键，选择“新建文件夹”。
3. 命名为 `python-foundation`。
4. 再次右键，选择“在集成终端中打开”。
5. 在终端里创建虚拟环境：

```powershell
python -m venv .venv

# 推荐：不激活环境，直接用 .venv 里的 Python
& ".\.venv\Scripts\python.exe" -m pip install --upgrade pip
& ".\.venv\Scripts\python.exe" -m pip install pydantic httpx pytest
& ".\.venv\Scripts\python.exe" -c "import sys; print(sys.executable)"
```

最后一行必须输出包含 `python-foundation\.venv` 的路径。

你也可以选择激活环境，让终端提示符出现 `(.venv)`：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\.venv\Scripts\Activate.ps1
python -c "import sys; print(sys.executable)"
```

重要：如果 `.\.venv\Scripts\Activate.ps1` 报 `UnauthorizedAccess`，**不要继续执行裸 `pip install`**。坏掉的是激活步骤，不是虚拟环境；直接使用上面的 `.\.venv\Scripts\python.exe` 即可。

如果脚本被禁止：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

终端提示符前通常会出现 `(.venv)`。

## 3. 选择正确的 Python 解释器

如果 VS Code 弹出“未找到 Python。是否使用 uv 安装 Python？”，请点击“取消”，不要安装第二个 Python。你的 `.venv` 已经存在，只需要让 VS Code 找到它。

先确认 VS Code 打开的是项目根目录，而不是父目录：

```text
E:\Project\0基础学agent\实战项目\python-foundation
```

操作：菜单栏 -> 文件 -> 打开文件夹 -> 选择 `python-foundation` -> 如果询问是否在新窗口打开，选择“是”。

项目里已经准备了 `.vscode/settings.json`：

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}\\.venv\\Scripts\\python.exe",
  "python.terminal.activateEnvironment": true,
  "python.testing.pytestEnabled": true,
  "python.testing.unittestEnabled": false,
  "python.testing.pytestArgs": ["tests"],
  "python.analysis.typeCheckingMode": "basic"
}
```

`${workspaceFolder}` 只有在 `python-foundation` 作为工作区根目录时才等于正确路径。如果工作区根目录是 `0基础学agent`，这个解释器路径就找不到。

如果 `Ctrl+Shift+P` 里找不到 `Python: Select Interpreter`，说明 Python 扩展没有安装或没有启用：

1. 按 `Ctrl+Shift+X` 打开扩展。
2. 搜索 `Python`。
3. 安装发布者为 `Microsoft` 的 Python 扩展。
4. 安装完成后按 `Ctrl+Shift+P`，执行 `Developer: Reload Window`。
5. 如果界面搜索失败，也可在终端执行：

```powershell
code --install-extension ms-python.python --force
```

当前电脑已经确认安装了以下扩展：

```text
ms-python.python
ms-python.vscode-pylance
ms-python.debugpy
ms-python.vscode-python-envs
```

这是 VS Code 最容易出错的一步。

1. 按 `Ctrl+Shift+P`。
2. 输入 `Python: Select Interpreter`。
3. 选择路径：

```text
E:\Project\0基础学agent\实战项目\python-foundation\.venv\Scripts\python.exe
```

如果看不到，选择“输入解释器路径”，然后把上面的完整路径粘贴进去。

在终端确认：

```powershell
python -c "import sys; print(sys.executable)"
```

输出必须包含 `python-foundation\.venv`。如果不是，先解决解释器问题，再写代码。

---

# 四、VS Code 里的标准练习循环

以后每一节都按这个循环做：

1. 资源管理器里新建一个 `.py` 文件。
2. 键入示例或自己的练习。
3. `Ctrl+S` 保存。
4. `Ctrl+F5` 运行。
5. 查看底部 `TERMINAL` 输出。
6. 故意改错一次，阅读 traceback。
7. 设置断点，按 `F5` 调试，观察变量。
8. 修好后再次运行。
9. 如果这一节有测试，在 Testing 面板运行。
10. 完成后用 Source Control 提交 Git。

不要只复制代码点运行。至少做三遍：照敲、关掉答案重写、故意改错再修复。

## 新建文件

1. 按 `Ctrl+Shift+E` 打开资源管理器。
2. 选中 `python-foundation`。
3. 点击文件夹名右侧的“新建文件”图标。
4. 输入路径，例如：

```text
exercises/01_io.py
```

VS Code 会自动创建 `exercises` 文件夹。

## 在编辑器里运行

打开 `exercises/01_io.py`，按键：

- `Ctrl+F5`：运行当前文件，不需要配置调试器。
- 右上角三角形旁的向下箭头：可以选“运行 Python 文件”或“调试 Python 文件”。
- 如果运行的是测试文件，优先在 Testing 面板运行。

## 路径要相对项目根目录

VS Code 集成终端默认在当前工作区根目录。例如工作区是 `python-foundation` 时：

```python
from pathlib import Path

path = Path("data") / "hello.txt"
```

最终文件会位于：

```text
python-foundation\data\hello.txt
```

如果发现文件生成到了奇怪位置，先看 VS Code 终端提示符所在目录，再看代码里的路径。

例如终端显示：

```text
PS E:\Project\0基础学agent\实战项目\python-foundation>
```

说明当前工作目录是 `python-foundation`。因此：

```text
Path("data")
```

表示：

```text
E:\Project\0基础学agent\实战项目\python-foundation\data
```

如果先执行 `cd exercises`，再运行脚本，那么 `Path("data")` 就会表示 `exercises\data`。这就是“相对路径”的含义：它相对于终端当前所在目录。

如果不希望受当前终端目录影响，可以改成相对脚本所在目录：

```python
BASE_DIR = Path(__file__).resolve().parent
path = BASE_DIR / "data" / "hello.txt"
```

这样无论从哪个目录启动，文件都固定写到 `01_io.py` 旁边的 `data` 目录。

## 打开生成的文本或 JSON

运行 `01_io.py` 后，按下面步骤找到文件：

1. 按 `Ctrl+Shift+E` 打开资源管理器。
2. 展开 `python-foundation`。
3. 展开 `data` 文件夹。
4. 双击 `hello.txt`。
5. 编辑区会显示文件内容。

如果资源管理器没更新，点击资源管理器标题栏的刷新图标，或在终端执行：

```powershell
Get-ChildItem -Recurse -Filter hello.txt
```

也可以在终端打印绝对路径：

```powershell
Get-Content .\data\hello.txt
```

重要：脚本里的 `write_text()` 默认每次都会覆盖文件。手动在 VS Code 里修改 `hello.txt` 后，如果重新运行 `01_io.py`，内容会被脚本再次覆盖。若想保留手动修改，应改用追加模式 `open("a")`，或先备份文件。

---

# 五、用调试器理解代码

调试比到处加 `print` 更适合理解程序。

创建 `exercises/debug_demo.py`：

```python
def average(values: list[int]) -> float:
    total = 0
    for item in values:
        total += item
    return total / len(values)

print(average([80, 90, 100]))
```

操作：

1. 在第 4 行 `total += item` 左侧灰色区域单击，出现红点，这是断点。
2. 按 `F5`。
3. 如果第一次按 `F5` 弹出“选择调试器”，先选择 `Python Debugger`。如果仍看不到 `Python File`，说明当前 VS Code 使用了新的调试界面；本项目已经提供 `.vscode/launch.json`。
4. 按 `Ctrl+Shift+P`，执行 `Developer: Reload Window`。
5. 打开 `Run and Debug` 面板，在顶部配置下拉框选择 `Python: Current File`。
6. 按 `F5` 或点击绿色运行按钮。程序停在第 4 行，左侧“变量 Variables”能看到 `values`、`total`、`item`。
7. 按 `F10` 单步执行。每按一次，`item` 和 `total` 会变化。
8. 继续按 `F10`，观察循环和最终结果。
9. 按 `Shift+F5` 停止。

调试常用按钮：

- 继续 Continue：`F5`
- 单步跳过 Step Over：`F10`
- 单步进入 Step Into：`F11`
- 单步跳出 Step Out：`Shift+F11`
- 重启 Restart：`Ctrl+Shift+F5`
- 停止 Stop：`Shift+F5`

## 调试异常

当程序抛异常时：

1. 看终端 traceback 的最后一行，通常是异常类型和原因。
2. 往上找到第一个属于你自己文件的路径和行号。
3. 在 VS Code 终端里 `Ctrl+单击` 文件路径，通常能跳到对应行。
4. 在可疑行设置断点，重新用 `F5` 运行。
5. 在“变量”面板检查输入是否为目标类型、列表是否为空、路径是否存在。

---

# 六、在 VS Code 中运行 pytest

## 1. 建立测试目录

```text
python-foundation/
├─ exercises/
├─ tests/
│  └─ test_demo.py
└─ .venv/
```

`tests/test_demo.py`：

```python
def test_addition() -> None:
    assert 1 + 1 == 2
```

测试文件名必须以 `test_` 开头，测试函数也必须以 `test_` 开头。

## 2. 配置 pytest

1. 按 `Ctrl+Shift+P`。
2. 输入 `Python: Configure Tests`。
3. 选择 `pytest`。
4. 选择测试目录 `tests`。
5. 如果提示安装 pytest，选择虚拟环境里安装。

也可以点击左侧烧瓶形状的 Testing 面板，然后点击“配置 Python 测试”。

## 3. 运行测试

在 `tests/test_demo.py` 中，`def test_addition` 上方会出现 `Run Test` 和 `Debug Test`。

- 点击 `Run Test`：运行单个测试。
- 点击 `Debug Test`：调试单个测试，可以打断点。
- 在 Testing 面板点击顶部播放键：运行全部测试。
- 点击漏斗图标：查看通过、失败、跳过。
- 在 `TERMINAL` 或 `TEST RESULTS` 面板查看失败详情。

## 4. 测试在项目根目录运行

推荐在 VS Code 集成终端执行：

```powershell
& ".\.venv\Scripts\python.exe" -m pytest -q
```

`-q` 表示简洁输出。出现失败时，先看断言左侧实际值、右侧期望值，再看测试调用的函数。

## 5. pytest 不识别怎么办

检查：

1. 文件名是否 `test_*.py`。
2. 函数名是否 `test_*`。
3. 是否在 VS Code 中打开了项目根目录。
4. 是否选择了 `.venv` 解释器。
5. `Ctrl+Shift+P` -> `Python: Configure Tests` 是否选择了 pytest。
6. 终端运行 `python -m pytest -q` 是否能用。
7. 若仍然没有，重启 VS Code窗口：`Ctrl+Shift+P` -> `Developer: Reload Window`。

---

# 七、在 VS Code 中使用 Git

## 1. 初始化仓库

在集成终端：

```powershell
git init
git status
```

## 2. 查看和提交修改

1. 按 `Ctrl+Shift+G` 打开源代码管理。
2. 修改文件后，Changes 列表会显示文件名。
3. 鼠标移到文件右侧，点 `+` 暂存；或点 Changes 旁边的 `+` 全部暂存。
4. 在上方输入提交信息，例如：

```text
feat: add file io exercise
```

5. 点击 Commit 按钮，或按 `Ctrl+Enter`。
6. 如果已配置远程仓库，可以点击 Sync Changes 推送。

## 3. 创建分支

点击 VS Code 左下角状态栏的分支名称（通常是 `main`），选择“创建新分支”，输入：

```text
feature/ledger
```

也可以在终端执行：

```powershell
git switch -c feature/ledger
```

## 4. 解决冲突

当 Source Control 显示某个文件处于“合并冲突”状态：

1. 点击冲突文件。
2. 编辑器里会出现 `Accept Current Change`、`Accept Incoming Change` 等按钮。
3. 不要无脑点任一按钮，先理解两边意图。
4. 编辑成最终版本，删除全部 `<<<<<<<`、`=======`、`>>>>>>>`。
5. 保存文件。
6. 在 Source Control 中暂存该文件，然后提交。
7. 运行 `python -m pytest -q`，确认解决冲突后项目仍然可用。

练习命令仍以 02B 的 Git 章节为准，但可以在 VS Code 的 Source Control 面板里完成暂存和提交。

---

# 八、推荐的 VS Code 工作区设置

在 `python-foundation` 下新建：

```text
.vscode/settings.json
```

内容：

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}\\.venv\\Scripts\\python.exe",
  "python.testing.pytestEnabled": true,
  "python.testing.unittestEnabled": false,
  "python.testing.pytestArgs": [
    "tests"
  ],
  "python.analysis.typeCheckingMode": "basic",
  "editor.formatOnSave": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

保存后按 `Ctrl+Shift+P` -> `Developer: Reload Window`。

注意：

- 必须先在项目里创建 `.venv`，这个路径才有意义。
- 如果使用 Ruff，可在保存时自动格式化。
- 设置文件必须是合法 JSON，不能写注释。
- `.vscode/` 可以提交 Git，但不要把个人密钥放进设置。

---

# 九、每一课在 VS Code 中怎么落文件

| 讲义 | VS Code 中新建的目录/文件 | 运行方式 |
|---|---|---|
| 02A 文件读写 | `exercises/01_io.py`、`data/` | `Ctrl+F5` |
| 02A 异常 | `exercises/02_exception.py` | `Ctrl+F5`，故意制造异常 |
| 02A 模块包 | `exercises/ledger/` 包 | 终端 `python -m ledger.cli` |
| 02A 类 | `exercises/04_dataclass.py` | `F5` 调试 |
| 02B typing/pydantic | `exercises/05_validation.py` | `Ctrl+F5` |
| 02B HTTP | `exercises/06_http.py` | `Ctrl+F5` |
| 02B async | `exercises/07_async.py` | `Ctrl+F5` |
| 02B pytest | `tests/test_*.py` | Testing 面板 / `pytest` |
| 02B Git | 当前项目 | Source Control 面板 |
| 02C 项目 1 | `ledger-cli/` | 打开该子目录或从根目录 `python -m` |
| 02C 项目 2 | `file-organizer/` | 先用 `--dry-run` |
| 02C 项目 3 | `bulk-api-query/` | `Ctrl+F5` + pytest |

对于项目 1、2、3，推荐每个项目单独作为 VS Code 工作区：

1. 在 VS Code 菜单选择“文件 -> 打开文件夹”。
2. 选择该项目根目录。
3. 创建独立 `.venv`。
4. 重新执行“选择解释器”和“配置测试”。

---

# 十、每天的实际操作模板

以第 1 课“文件读写”为例，完整操作流程：

1. 打开 `E:\Project\0基础学agent`。
2. 在资源管理器中进入 `实战项目\python-foundation`。
3. 在集成终端激活 `.venv`。
4. 新建 `exercises/01_io.py`。
5. 写入一段 JSON 保存和读取代码。
6. `Ctrl+S` 保存。
7. `Ctrl+F5` 运行。
8. 在终端确认输出。
9. 双击 `data/account.json`，观察真实文件内容。
10. 把 JSON 改成非法格式，再运行，观察 `JSONDecodeError`。
11. 在第 8 行按 `F9` 设置断点，按 `F5`，查看变量。
12. 修好代码，`Ctrl+F5` 再跑。
13. 打开 `Ctrl+Shift+G`，暂存文件，提交：

```text
feat: practice file io and json
```

14. 在讲义对应位置写一句今天理解了什么、卡在哪里。

---

# 十一、VS Code 常见问题和解决

## 1. 终端里的 Python 不是虚拟环境

终端执行：

```powershell
python -c "import sys; print(sys.executable)"
```

若路径没有 `.venv`：

```powershell
& ".\.venv\Scripts\python.exe" -c "import sys; print(sys.executable)"
```

如果路径包含 `.venv`，就说明你已经在使用虚拟环境，不需要执着于激活脚本。

然后重新选择解释器：`Ctrl+Shift+P` -> `Python: Select Interpreter`。

## 2. 报 `ModuleNotFoundError`

先确认解释器，再确认依赖：

```powershell
& ".\.venv\Scripts\python.exe" -c "import sys; print(sys.executable)"
& ".\.venv\Scripts\python.exe" -m pip show pydantic httpx pytest
```

如果模块是项目自己的包，例如 `ledger`，要在项目根目录运行：

```powershell
python -m ledger.cli
```

不要随便在子目录里直接执行 `python cli.py`。

## 3. 运行按钮没有反应

确认：

- 文件已保存。
- 右下角选择的是 Python 解释器。
- 打开的是包含 `.py` 文件的编辑器。
- 查看 `TERMINAL` 输出，而不是只盯编辑器。

## 4. 中文乱码

读写文件时统一使用：

```python
path.read_text(encoding="utf-8")
path.write_text(text, encoding="utf-8")
```

终端显示乱码时，先确认文件编码为 UTF-8，并在 PowerShell 中查看：

```powershell
Get-Content -Encoding utf8 .\data\hello.txt
```

## 5. Ctrl+F5 运行了错误的文件

VS Code 默认运行当前获得焦点的编辑器文件。点击你要运行的文件标签，再按 `Ctrl+F5`。也可以右键编辑器 -> `Run Python File in Terminal`。

## 6. 终端被 pytest 卡住

按 `Ctrl+C` 停止当前命令，然后重新运行：

```powershell
& ".\.venv\Scripts\python.exe" -m pytest -q
```

如果需要新终端：点终端右侧的 `+`，或按 Ctrl+Shift+反引号。

## 7. 看不到 Testing 面板

按 `Ctrl+Shift+P`，输入：

```text
Testing: Focus on Test Explorer View
```

然后配置 pytest。测试面板不是自动出现的，只有检测到测试文件或配置测试后才明显。

---

# 十二、记住这一句话

> 在 VS Code 中，项目文件夹是根，集成终端是执行命令的地方，Python 解释器决定依赖从哪里来，Testing 面板运行测试，Source Control 面板提交代码。

只要这五件事不乱：

1. 打开的文件夹正确。
2. 终端在项目根目录。
3. 选择的是 `.venv` 解释器。
4. 用 `Ctrl+S` 保存后再运行。
5. 出错先读 traceback 最后一行。

后面的 Python 学习就不会被环境问题拖住。
