from pathlib import Path

import api.main as api_main
from fastapi.testclient import TestClient


# 测试导入同一个 FastAPI 应用对象。
client = TestClient(api_main.app)


def test_generate_creates_dataset(tmp_path: Path, monkeypatch) -> None:
    """POST /generate 应生成文件并返回 manifest。"""
    # 把输出目录替换为 pytest 提供的临时目录，测试后自动清理。
    output_dir = tmp_path / "api_generated"
    monkeypatch.setattr(api_main, "GENERATED_DATA_DIR", output_dir)

    response = client.post(
        "/generate",
        json={"batch_count": 3, "seed": 7},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["manifest"]["batch_count"] == 3
    assert body["manifest"]["seed"] == 7
    assert (output_dir / "batches.csv").exists()
    assert (output_dir / "knowledge" / "sop_dispensing.md").exists()


def test_generate_rejects_invalid_batch_count(
    tmp_path: Path,
    monkeypatch,
) -> None:
    """batch_count=0 应在请求校验阶段返回 HTTP 422。"""
    output_dir = tmp_path / "api_generated"
    monkeypatch.setattr(api_main, "GENERATED_DATA_DIR", output_dir)

    response = client.post(
        "/generate",
        json={"batch_count": 0, "seed": 7},
    )

    assert response.status_code == 422
    body = response.json()
    assert body["error_code"] == "REQUEST_VALIDATION_ERROR"
    assert body["message"] == "请求参数校验失败"
    assert body["details"]["field"] == "batch_count"
    assert not output_dir.exists()


def test_openapi_documents_generate_models() -> None:
    """OpenAPI 文档应包含 /generate 的请求和响应模型。"""
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schema = response.json()
    assert "/generate" in schema["paths"]
    assert "GenerateRequest" in schema["components"]["schemas"]
    assert "GenerateResponse" in schema["components"]["schemas"]
    assert "ErrorResponse" in schema["components"]["schemas"]


def test_unknown_route_returns_structured_error() -> None:
    """不存在的路径也应返回统一的 404 错误结构。"""
    response = client.get("/not-found")

    assert response.status_code == 404
    assert response.json() == {
        "error_code": "NOT_FOUND",
        "message": "请求的路径不存在",
        "details": None,
    }


def test_unhandled_error_returns_500(
    monkeypatch,
    caplog,
) -> None:
    """未处理异常应返回统一 500，并写入错误日志。"""

    class FailingGenerator:
        """用于测试的失败生成器。"""

        def __init__(self, output_dir: Path, batch_count: int, seed: int) -> None:
            # 保存参数，保持与真实生成器一致的构造方式。
            self.output_dir = output_dir
            self.batch_count = batch_count
            self.seed = seed

        def generate(self) -> dict[str, object]:
            """模拟未处理的服务器内部异常。"""
            raise RuntimeError("模拟生成器内部错误")

    # 替换生成器类，让接口走到未处理异常分支。
    monkeypatch.setattr(api_main, "SyntheticQualityGenerator", FailingGenerator)

    # 关闭测试客户端重新抛出异常，才能检查真实 HTTP 响应。
    error_client = TestClient(api_main.app, raise_server_exceptions=False)
    with caplog.at_level("ERROR", logger="industrial_quality_api"):
        response = error_client.post(
            "/generate",
            json={"batch_count": 3, "seed": 7},
        )

    assert response.status_code == 500
    assert response.json() == {
        "error_code": "INTERNAL_SERVER_ERROR",
        "message": "服务器内部错误",
        "details": None,
    }
    assert "未处理异常" in caplog.text
    assert "模拟生成器内部错误" in caplog.text
