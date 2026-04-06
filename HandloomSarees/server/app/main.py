# # from contextlib import asynccontextmanager

# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware

# # from app.api.v1.router import api_router
# # from app.core.config import settings
# # from app.core.exceptions import register_exception_handlers
# # from app.core.logging import setup_logging


# # @asynccontextmanager
# # async def lifespan(_: FastAPI):
# #     setup_logging()
# #     yield


# # app = FastAPI(
# #     title=settings.APP_NAME,
# #     version=settings.APP_VERSION,
# #     debug=settings.DEBUG,
# #     docs_url="/docs",
# #     redoc_url="/redoc",
# #     openapi_url="/openapi.json",
# #     lifespan=lifespan,
# # )

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=settings.BACKEND_CORS_ORIGINS,
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # register_exception_handlers(app)
# # app.include_router(api_router, prefix=settings.API_V1_PREFIX)



# from contextlib import asynccontextmanager

# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from slowapi.errors import RateLimitExceeded
# from slowapi.middleware import SlowAPIMiddleware

# from app.api.v1.router import api_router
# from app.core.config import settings
# from app.core.exceptions import register_exception_handlers
# from app.core.logging import setup_logging
# from app.core.rate_limit import limiter


# @asynccontextmanager
# async def lifespan(_: FastAPI):
#     setup_logging()
#     yield


# app = FastAPI(
#     title=settings.APP_NAME,
#     version=settings.APP_VERSION,
#     debug=settings.DEBUG,
#     docs_url="/docs",
#     redoc_url="/redoc",
#     openapi_url="/openapi.json",
#     lifespan=lifespan,
# )

# app.state.limiter = limiter
# app.add_middleware(SlowAPIMiddleware)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.BACKEND_CORS_ORIGINS,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.exception_handler(RateLimitExceeded)
# async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
#     return JSONResponse(
#         status_code=429,
#         content={
#             "success": False,
#             "message": "Rate limit exceeded",
#             "data": None,
#         },
#     )


# register_exception_handlers(app)
# app.include_router(api_router, prefix=settings.API_V1_PREFIX)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import add_exception_handlers

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_exception_handlers(app)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "success": True,
        "message": f"{settings.APP_NAME} is running",
        "data": {
            "environment": settings.APP_ENV,
        },
    }