import logging
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlette.exceptions import HTTPException as StarletteHTTPException

from quality_data.generator import SyntheticQualityGenerator


# 创建模块级日志记录器，用于记录服务器内部异常。
logger = logging.getLogger("industrial_quality_api")


# API 默认生成目录；测试时会替换成临时目录，避免污染项目数据。
GENERATED_DATA_DIR = Path("data/api_generated")


class GenerateRequest(BaseModel):
    """定义 POST /generate 的 JSON 请求体。"""

    # Field 负责在校验层限制范围，避免把明显错误的参数交给生成器。
    batch_count: int = Field(default=120, ge=1, le=10000)
    seed: int = Field(default=42, ge=0)


class GenerateManifest(BaseModel):
    """定义合成数据 manifest 的成功响应结构。"""

    dataset_name: str
    dataset_version: str
    is_synthetic: bool
    seed: int
    batch_count: int
    document_count: int
    question_count: int
    files: list[str]
    notice: str


class GenerateResponse(BaseModel):
    """定义 POST /generate 的成功响应结构。"""

    message: str
    output_dir: str
    manifest: GenerateManifest


class ErrorResponse(BaseModel):
    """定义统一错误响应结构。"""

    error_code: str
    message: str
    details: dict[str, Any] | None = None


# 创建 FastAPI 应用对象，uvicorn 启动服务时会加载这个变量。
app = FastAPI(
    title="工业质量 Agent API",
    version="0.1.0",
    description="仅使用合成数据的工业质量分析服务。",
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """把 FastAPI/Pydantic 的请求参数错误转换成统一格式。"""
    # 当前接口只有一个请求体错误，因此取第一条错误用于返回。
    first_error = exc.errors()[0]
    field = ".".join(str(item) for item in first_error["loc"] if item != "body")
    content = ErrorResponse(
        error_code="REQUEST_VALIDATION_ERROR",
        message="请求参数校验失败",
        details={
            "field": field,
            "reason": first_error["msg"],
        },
    )
    return JSONResponse(status_code=422, content=content.model_dump())


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
) -> JSONResponse:
    """把普通 HTTP 异常转换成统一格式。"""
    if exc.status_code == 404:
        error_code = "NOT_FOUND"
        message = "请求的路径不存在"
    elif exc.status_code == 422:
        error_code = "VALIDATION_ERROR"
        message = str(exc.detail)
    else:
        error_code = "HTTP_ERROR"
        message = str(exc.detail)

    content = ErrorResponse(
        error_code=error_code,
        message=message,
    )
    return JSONResponse(status_code=exc.status_code, content=content.model_dump())


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """记录未处理异常，并返回不泄露内部细节的统一 500 响应。"""
    # 日志中保留真实异常，便于开发人员排查问题。
    logger.exception(
        "未处理异常：method=%s path=%s",
        request.method,
        request.url.path,
    )
    content = ErrorResponse(
        error_code="INTERNAL_SERVER_ERROR",
        message="服务器内部错误",
    )
    return JSONResponse(status_code=500, content=content.model_dump())


@app.get("/health")
def health_check() -> dict[str, str]:
    """返回服务健康状态，供调用方确认服务是否可用。"""
    return {
        "status": "ok",
        "service": "industrial-quality-agent",
        "version": "0.1.0",
    }


@app.post(
    "/generate",
    responses={
        422: {
            "model": ErrorResponse,
            "description": "请求参数校验失败",
        },
        500: {
            "model": ErrorResponse,
            "description": "服务器内部错误",
        },
    },
)
def generate_dataset(request: GenerateRequest) -> GenerateResponse:
    """接收 JSON 参数，生成合成数据并返回 manifest。"""
    try:
        # 复用已有的数据生成器，避免在 API 中重复实现生成逻辑。
        generator = SyntheticQualityGenerator(
            output_dir=GENERATED_DATA_DIR,
            batch_count=request.batch_count,
            seed=request.seed,
        )
        manifest = generator.generate()
    except ValueError as exc:
        # 把生成器参数错误转换成标准 HTTP 422 响应。
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    # 用响应模型组装返回内容，保证字段和类型稳定。
    return GenerateResponse(
        message="合成数据生成完成",
        output_dir=str(GENERATED_DATA_DIR.resolve()),
        manifest=GenerateManifest(**manifest),
    )
