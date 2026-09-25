# 02B：类型校验、HTTP、异步、pytest 与 Git 冲突

> 这一册回答四个问题：怎样定义清楚数据？怎样调用外部 API？怎样并发但不失控？怎样用测试和 Git 保证代码不坏？
>
> VS Code 操作总览见 `00-VSCode练习操作手册.md`。本册的 HTTP、异步和测试示例必须先在 `.venv` 中安装 `pydantic`、`httpx`、`pytest`。

---

# 一、typing 类型注解

> VS Code 练法：新建 `exercises/05_validation.py`。输入 pydantic 示例，按 `Ctrl+F5`；再故意传空 `note` 或负数金额，在 `TERMINAL` 查看 `ValidationError` 的字段路径。

## 1. 注解解决什么

```python
def add(a: int, b: int) -> int:
    return a + b

names: list[str] = []
scores: dict[str, int] = {}
maybe_name: str | None = None
```

类型注解的价值：

- 让读代码的人知道输入输出。
- 让 VS Code 补全和提示更准确。
- 让 mypy / pyright 在运行前发现潜在类型错误。
- 让 FastAPI、pydantic 等框架生成校验和文档。

关键事实：普通 Python 函数注解默认不强制类型，下面代码能运行：

```python
print(add("1", "2"))  # 12
```

所以：typing 负责说明，pydantic 负责运行时校验。

## 2. Python 3.10 常用写法

```python
from collections.abc import Iterable
from typing import Any, Callable, Literal

name: str
age: int | None
items: list[dict[str, object]]
mapping: dict[str, int]
callback: Callable[[int], str]
kind: Literal["income", "expense"]
```

- `str | None`：字符串或空值，Python 3.10 支持。
- `list[str]`：字符串列表，Python 3.9+ 支持。
- `Any`：放弃检查，尽量少用。
- `Literal`：只能是列出的固定值。

## 3. pydantic：在边界校验外部数据

外部数据包括用户输入、JSON、API 响应、LLM 输出，必须当作不可信数据。

```python
from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, Field, field_validator

class Transaction(BaseModel):
    amount_cents: int = Field(gt=0, description="金额，单位分")
    note: str = Field(min_length=1, max_length=100)
    kind: Literal["income", "expense"] = "expense"
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    @field_validator("note")
    @classmethod
    def strip_note(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("备注不能为空")
        return value
```

创建与校验：

```python
raw = {"amount_cents": "3000", "note": "  午餐  "}
tx = Transaction.model_validate(raw)
print(tx.amount_cents)  # 3000
print(repr(tx.note))    # '午餐'
```

pydantic v2 默认会做宽松转换，比如数字字符串转整数。严格模式：

```python
tx = Transaction.model_validate(raw, strict=True)
```

捕获字段级错误：

```python
from pydantic import ValidationError

try:
    Transaction.model_validate({"amount_cents": -1, "note": ""})
except ValidationError as exc:
    for error in exc.errors():
        print(error["loc"], error["msg"])
```

转换结果：

```python
tx.model_dump()             # Python 对象形式
tx.model_dump(mode="json")  # 可 JSON 序列化形式
Transaction.model_validate_json('{"amount_cents": 100, "note": "测试"}')
```

## 4. dataclass 与 pydantic 怎么选

| 场景 | 选择 |
|---|---|
| 程序内部、可信数据、轻量对象 | dataclass |
| 用户输入、JSON、API、LLM 输出 | pydantic |
| 需要字段级校验和转换 | pydantic |
| 性能敏感且无需校验 | dataclass |

实用规则：**数据刚进入程序的第一道门用 pydantic；进入内部后可按需使用 dataclass。**

---

# 二、HTTP API 与 requests / httpx

> VS Code 练法：新建 `exercises/06_http.py`。确认底栏终端已激活 `.venv`，按 `Ctrl+F5`。如果网络失败，先用浏览器访问 JSONPlaceholder；如果能访问，再检查 Python 的超时和代理设置。

## 1. 请求与响应

HTTP 请求：

- 方法：GET 查询、POST 创建、PUT/PATCH 更新、DELETE 删除。
- URL：`https://api.example.com/v1/posts/1`
- 查询参数：`?page=1&limit=20`
- 请求头：认证、内容类型。
- 请求体：通常 JSON。

响应：

- 状态码：200 成功、201 创建、400 请求错误、401 未认证、404 不存在、429 太频繁、5xx 服务错误。
- 响应头。
- 响应体，常见是 JSON。

## 2. requests 最小示例

```python
import requests

try:
    response = requests.get(
        "https://jsonplaceholder.typicode.com/posts/1",
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    print(data["title"])
except requests.Timeout:
    print("请求超时")
except requests.HTTPError as exc:
    print(f"HTTP 错误：{exc.response.status_code}")
except requests.RequestException as exc:
    print(f"请求失败：{exc}")
```

必须记住：

- 一定要设置 `timeout`。
- 404/500 默认不抛异常，`raise_for_status()` 才抛。
- `response.json()` 可能因响应不是 JSON 而失败。
- 不要把 API Key 打进日志。

参数和 POST：

```python
response = requests.get(
    "https://jsonplaceholder.typicode.com/posts",
    params={"userId": 1},
    headers={"Accept": "application/json"},
    timeout=10,
)
response.raise_for_status()
posts = response.json()

created = requests.post(
    "https://jsonplaceholder.typicode.com/posts",
    json={"title": "hello", "body": "world", "userId": 1},
    timeout=10,
)
created.raise_for_status()
```

密钥放 `.env` 或环境变量，`.env` 不提交 Git，另提供 `.env.example`。

## 3. httpx 同步与复用连接

```python
import httpx

with httpx.Client(timeout=10) as client:
    response = client.get("https://jsonplaceholder.typicode.com/posts/1")
    response.raise_for_status()
    data = response.json()
    print(data["title"])
```

`with` 会关闭客户端并复用连接池。

用 pydantic 校验响应：

```python
from pydantic import BaseModel, Field, ValidationError

class Post(BaseModel):
    id: int
    user_id: int = Field(alias="userId")
    title: str
    body: str

try:
    post = Post.model_validate(response.json())
except ValidationError as exc:
    print("返回结构不符合预期：", exc)
```

## 4. 重试原则

只重试这类情况：

- 连接/读取超时。
- HTTP 429。
- HTTP 502、503、504。

不要盲目重试 POST，否则可能重复创建订单。重试使用指数退避：

```python
import time
import httpx

def get_with_retry(url: str, attempts: int = 3) -> httpx.Response:
    last_exc: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            response = httpx.get(url, timeout=10)
            if response.status_code in {429, 502, 503, 504} and attempt < attempts:
                time.sleep(0.5 * 2 ** (attempt - 1))
                continue
            response.raise_for_status()
            return response
        except httpx.TransportError as exc:
            last_exc = exc
            if attempt == attempts:
                break
            time.sleep(0.5 * 2 ** (attempt - 1))
    raise RuntimeError("请求多次失败") from last_exc
```

生产环境还要限制总耗时，并加随机抖动。

---

# 三、async / await 与 asyncio.gather

> VS Code 练法：新建 `exercises/07_async.py`。先运行顺序版，再运行 `gather` 版，比较终端输出耗时。可在 `await` 前后按 `F9` 设置断点，按 `F5` 观察协程的执行顺序。

## 1. 异步解决什么

同步请求必须等待；异步在 `await` 时把控制权还给事件循环，让其他请求先跑。

- 同步：点一杯咖啡，站着等完再点下一杯。
- 异步：一次提交 10 杯订单，谁先做好谁先取。

异步适合网络、数据库等 I/O 密集任务。CPU 密集任务应使用多进程。

## 2. 协程不能直接调用

```python
import asyncio

async def hello() -> str:
    await asyncio.sleep(1)
    return "hello"

async def main() -> None:
    result = await hello()
    print(result)

asyncio.run(main())
```

- `async def` 调用后得到协程对象，不会立刻执行。
- `await` 才等待结果。
- `await` 只能在 `async def` 中。
- 脚本入口用 `asyncio.run(main())`。

## 3. 顺序与并发

```python
async def sequential() -> None:
    await asyncio.sleep(1)
    await asyncio.sleep(1)
    await asyncio.sleep(1)  # 约 3 秒

async def concurrent() -> None:
    await asyncio.gather(
        asyncio.sleep(1),
        asyncio.sleep(1),
        asyncio.sleep(1),
    )  # 约 1 秒
```

`gather` 并发运行多个可等待对象，返回顺序与输入顺序一致。

## 4. 异步 HTTP

```python
import asyncio
import httpx

async def fetch_post(client: httpx.AsyncClient, post_id: int) -> dict:
    response = await client.get(f"/posts/{post_id}")
    response.raise_for_status()
    return response.json()

async def main() -> None:
    async with httpx.AsyncClient(
        base_url="https://jsonplaceholder.typicode.com",
        timeout=10,
    ) as client:
        posts = await asyncio.gather(
            fetch_post(client, 1),
            fetch_post(client, 2),
            fetch_post(client, 3),
        )
        for post in posts:
            print(post["id"], post["title"])

asyncio.run(main())
```

绝不要在异步函数里使用 `requests.get` 或 `time.sleep`，它们会阻塞整个事件循环。

## 5. 限流、超时、错误隔离

限制并发：

```python
semaphore = asyncio.Semaphore(5)

async def limited_fetch(client: httpx.AsyncClient, post_id: int) -> dict:
    async with semaphore:
        response = await client.get(f"/posts/{post_id}")
        response.raise_for_status()
        return response.json()
```

超时：

```python
try:
    result = await asyncio.wait_for(fetch_post(client, 1), timeout=3)
except asyncio.TimeoutError:
    print("单次请求超时")
```

单条失败不终止整批：

```python
results = await asyncio.gather(
    fetch_post(client, 1),
    fetch_post(client, 2),
    return_exceptions=True,
)

for result in results:
    if isinstance(result, Exception):
        print("失败：", result)
    else:
        print("成功：", result["id"])
```

Python 3.11+ 可使用 `asyncio.TaskGroup` 和 `asyncio.timeout`，你当前 3.10 先用 `gather` 和 `wait_for`。

## 6. 常见误区

1. 以为 `async def` 自动并发，实际还要创建多个任务并等待。
2. 忘记 `await`，得到 `coroutine was never awaited`。
3. 在异步函数里用阻塞库。
4. 不设超时、不限并发。
5. 不检查 `gather` 的结果中是否混入异常。

---

# 四、pytest

> VS Code 练法：在资源管理器新建 `tests/test_*.py`。按 `Ctrl+Shift+P`，运行 `Python: Configure Tests`，选择 `pytest` 和 `tests` 目录。之后点击左侧 Testing 面板，可以单独运行或调试每个测试。

## 1. 安装与发现规则

```powershell
& ".\.venv\Scripts\python.exe" -m pip install pytest
& ".\.venv\Scripts\python.exe" -m pytest -q
```

如果 PowerShell 不允许激活 `.venv`，直接调用 `.\.venv\Scripts\python.exe` 即可；不要因为激活失败就使用全局 `pip`。

pytest 发现 `test_*.py`、`*_test.py` 中的 `test_*` 函数和 `Test*` 类。

## 2. 测试结构

Arrange -> Act -> Assert：

```python
from ledger.service import calculate_total

def test_calculate_total_adds_expenses() -> None:
    transactions = [100, 250, 300]
    total = calculate_total(transactions)
    assert total == 650
```

## 3. 测试异常

```python
import pytest

def test_invalid_amount_raises() -> None:
    with pytest.raises(ValueError, match="金额"):
        parse_amount("abc")
```

## 4. 参数化

```python
@pytest.mark.parametrize(
    ("raw", "expected"),
    [("1", 100), ("30", 3000), ("12.5", 1250)],
)
def test_parse_amount(raw: str, expected: int) -> None:
    assert parse_amount(raw) == expected
```

## 5. 临时文件与 fixture

```python
import pytest
from pathlib import Path

@pytest.fixture
def data_file(tmp_path: Path) -> Path:
    path = tmp_path / "transactions.json"
    save_transactions(path, [])
    return path

def test_list_empty(data_file: Path) -> None:
    assert load_transactions(data_file) == []
```

`tmp_path` 为每个测试提供独立临时目录，绝不能污染真实账本。

## 6. Mock HTTP，不访问真实网络

```python
import httpx

def test_response_json() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={"id": 1, "title": "hello"})

    transport = httpx.MockTransport(handler)
    with httpx.Client(transport=transport, base_url="https://fake.test") as client:
        response = client.get("/posts/1")
        assert response.json()["title"] == "hello"
```

测试金字塔：核心业务函数直接测；HTTP 客户端用 MockTransport；真实 API 只做少量集成测试。

## 7. 至少 10 个测试示例

1. 添加交易成功。
2. 金额为 0 失败。
3. 金额非数字失败。
4. 空账本读取返回空列表。
5. 写入后能读回。
6. summary 总额正确。
7. JSON 损坏抛 StorageError。
8. 按扩展名分类正确。
9. dry-run 不移动文件。
10. 重名文件加序号。
11. API JSON 能转成 pydantic 模型。
12. API 404 能转成友好错误。

必须覆盖正常、边界、错误三条路径。

---

# 五、Git 分支与合并冲突

> VS Code 练法：按 `Ctrl+Shift+G` 打开 Source Control。先暂存并提交；再点击左下角状态栏的分支名创建 `feature/...`。发生冲突时，点击冲突文件，使用编辑器里的合并按钮，但最终仍要手工确认代码并运行 pytest。

## 1. 分支模型

提交是历史链，分支只是指向提交的可移动指针。

- `main`：始终可运行、可发布。
- `feature/xxx`：开发具体功能。
- 每个 commit 是项目某一刻的快照。

常用命令：

```powershell
git status
git branch
git switch main
git switch -c feature/ledger
git add .
git commit -m "feat: add ledger storage"
git push -u origin feature/ledger
```

推荐流程：从最新 `main` 建分支 -> 小步提交 -> 跑测试 -> push -> 开 PR -> CI/Review 后合并。

## 2. 冲突为什么发生

两个分支改了同一文件同一区域，Git 无法替你决定保留哪一个。

冲突标记：

```text
<<<<<<< HEAD
当前分支内容
=======
要合并分支内容
>>>>>>> feature-a
```

`HEAD` 是当前分支；下半段是正在合并的分支。

## 3. 亲手制造并解决一次冲突

在练习目录实验：

```powershell
mkdir git-conflict-demo
cd git-conflict-demo
git init

Set-Content -Path hello.txt -Value "version: base" -Encoding utf8
git add hello.txt
git commit -m "chore: initial hello"

git switch -c feature-a
Set-Content -Path hello.txt -Value "version: A" -Encoding utf8
git commit -am "feat: version A"

git switch main
git switch -c feature-b
Set-Content -Path hello.txt -Value "version: B" -Encoding utf8
git commit -am "feat: version B"

git merge feature-a
```

此时 `git status` 显示 `both modified: hello.txt`。文件类似：

```text
<<<<<<< HEAD
version: B
=======
version: A
>>>>>>> feature-a
```

假设最终要同时保留信息，改成：

```text
version: A+B
```

完成：

```powershell
git add hello.txt
git commit -m "merge: resolve hello version conflict"
git log --oneline --graph --all
```

想放弃本次合并：

```powershell
git merge --abort
```

## 4. 正确解决冲突的步骤

1. `git status` 找冲突文件。
2. 理解两边各自意图，必要时和作者确认。
3. 编辑成最终正确版本，删除所有冲突标记。
4. 运行测试。
5. `git add <文件>`。
6. `git commit`。
7. 确认没有把 `<<<<<<<`、`=======`、`>>>>>>>` 提交进仓库。

## 5. 危险命令

初学阶段不要随手执行：

```powershell
git reset --hard
git clean -fd
git push --force
```

这些命令可能丢代码或覆盖别人的提交。需要时先理解影响、备份并确认。

## 6. 本册练习

1. 给一个函数写 10 个测试，必须包含失败路径。
2. 用 MockTransport 模拟 200、404、429。
3. 用 `asyncio.gather` 并发 20 个请求并限流。
4. 完成一次冲突制造、解决、提交，并写出冲突原因。