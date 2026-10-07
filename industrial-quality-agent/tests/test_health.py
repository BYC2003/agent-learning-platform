from fastapi.testclient import TestClient

from api.main import app


# TestClient 可以在不真正启动服务器的情况下调用 FastAPI 接口。
client = TestClient(app)


def test_health_check_returns_ok() -> None:
    """健康检查应返回 HTTP 200 和稳定的 JSON 内容。"""
    response = client.get("/health")

    # 检查 HTTP 状态码和响应正文。
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "industrial-quality-agent",
        "version": "0.1.0",
    }
