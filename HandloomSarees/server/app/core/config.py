# from pydantic_settings import BaseSettings, SettingsConfigDict
# from functools import lru_cache
# from typing import List

# from pydantic import Field, field_validator



# class Settings(BaseSettings):
#     model_config = SettingsConfigDict(
#         env_file=".env",
#         env_file_encoding="utf-8",
#         case_sensitive=True,
#         extra="ignore",
#     )
#     from pydantic_settings import BaseSettings, SettingsConfigDict


# class Settings(BaseSettings):
#     APP_NAME: str = "Neyge Couture Backend"
#     APP_ENV: str = "development"
#     DEBUG: bool = True

#     SUPABASE_URL: str
#     SUPABASE_SERVICE_ROLE_KEY: str
#     SUPABASE_ANON_KEY: str

#     JWT_SECRET: str
#     JWT_ALGORITHM: str = "HS256"
#     JWT_EXPIRE_MINUTES: int = 60

#     RAZORPAY_KEY_ID: str
#     RAZORPAY_KEY_SECRET: str

#     CLOUDINARY_CLOUD_NAME: str
#     CLOUDINARY_API_KEY: str
#     CLOUDINARY_API_SECRET: str

#     FRONTEND_URL: str = "http://localhost:3000"

#     model_config = SettingsConfigDict(
#         env_file=".env",
#         extra="ignore",
#         case_sensitive=True,
#     )


# settings = Settings()

#     # APP_NAME: str = "Neyge Couture Backend"
#     # APP_VERSION: str = "1.0.0"
#     # APP_ENV: str = "development"
#     # DEBUG: bool = True
#     # API_V1_PREFIX: str = "/api/v1"

#     # HOST: str = "0.0.0.0"
#     # PORT: int = 8000

#     # ENABLE_SUPABASE: bool = True

#     # SUPABASE_URL: str = Field(..., min_length=10)
#     # SUPABASE_ANON_KEY: str = Field(..., min_length=20)
#     # SUPABASE_SERVICE_ROLE_KEY: str = Field(..., min_length=20)

#     # RAZORPAY_KEY_ID: str = Field(..., min_length=5)
#     # RAZORPAY_KEY_SECRET: str = Field(..., min_length=5)

#     # BACKEND_CORS_ORIGINS: List[str] | str = ["http://localhost:5173"]

#     # RATE_LIMIT_DEFAULT: str = "100/minute"
#     # RATE_LIMIT_LOGIN: str = "10/minute"
#     # RATE_LIMIT_REGISTER: str = "5/minute"


#     # CLOUDINARY_CLOUD_NAME: str
#     # CLOUDINARY_API_KEY: str
#     # CLOUDINARY_API_SECRET: str

# @field_validator("BACKEND_CORS_ORIGINS", mode="before")
# @classmethod
# def parse_cors(cls, value: str | List[str]) -> List[str]:
#         if isinstance(value, str):
#             return [item.strip() for item in value.split(",") if item.strip()]
#         return value


# @lru_cache
# def get_settings() -> Settings:
#     return Settings()


# settings = get_settings()







from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Neyge Couture Backend"
    APP_ENV: str = "development"
    DEBUG: bool = True

    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()