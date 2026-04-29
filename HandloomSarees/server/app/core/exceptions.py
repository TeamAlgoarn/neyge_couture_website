# from fastapi import FastAPI, Request, status
# from fastapi.exceptions import RequestValidationError
# from fastapi.responses import JSONResponse


# class AppException(Exception):
#     def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
#         self.message = message
#         self.status_code = status_code
#         super().__init__(message)


# def register_exception_handlers(app: FastAPI) -> None:
#     @app.exception_handler(AppException)
#     async def app_exception_handler(_: Request, exc: AppException):
#         return JSONResponse(
#             status_code=exc.status_code,
#             content={"success": False, "message": exc.message, "data": None},
#         )

#     @app.exception_handler(RequestValidationError)
#     async def validation_exception_handler(_: Request, exc: RequestValidationError):
#         return JSONResponse(
#             status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#             content={"success": False, "message": "Validation error", "data": exc.errors()},
#         )

#     @app.exception_handler(Exception)
#     async def unhandled_exception_handler(_: Request, exc: Exception):
#         return JSONResponse(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             content={"success": False, "message": "Internal server error", "data": None},
#         )







from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.utils.response import error_response


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(exc.detail if isinstance(exc.detail, str) else "Request failed"),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=error_response(
                "Validation error",
                exc.errors(),
            ),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response("Internal server error"),
        )