from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.utils.response import error_response


SENSITIVE_FIELD_NAMES = {
    "password",
    "current_password",
    "new_password",
    "confirm_password",
    "access_token",
    "refresh_token",
    "token",
    "secret",
}


def _redact_sensitive_input(value):
    if isinstance(value, dict):
        return {
            key: "[redacted]" if key.lower() in SENSITIVE_FIELD_NAMES else _redact_sensitive_input(item)
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [_redact_sensitive_input(item) for item in value]
    return value


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(exc.detail if isinstance(exc.detail, str) else "Request failed"),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        raw_errors = exc.errors()
        clean_errors = []
        for err in raw_errors:
            err_dict = dict(err)
            location = {str(part).lower() for part in err_dict.get("loc", ())}
            if location & SENSITIVE_FIELD_NAMES:
                err_dict["input"] = "[redacted]"
            elif "input" in err_dict:
                err_dict["input"] = _redact_sensitive_input(err_dict["input"])
            if "ctx" in err_dict and isinstance(err_dict["ctx"], dict):
                err_dict["ctx"] = {
                    k: str(v) if isinstance(v, Exception) else v
                    for k, v in err_dict["ctx"].items()
                }
            clean_errors.append(err_dict)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            content=error_response(
                "Validation error",
                clean_errors,
            ),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response("Internal server error"),
        )
