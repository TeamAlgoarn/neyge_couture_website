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
from typing import Any
from urllib.parse import urlparse

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Neyge Couture Backend"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str = ""

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # WhatsApp
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = ""
    WHATSAPP_ACCESS_TOKEN: str = ""
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: str = ""
    WHATSAPP_APP_SECRET: str = ""
    WHATSAPP_API_VERSION: str = "v25.0"

    # Instagram
    INSTAGRAM_BUSINESS_ACCOUNT_ID: str = ""
    INSTAGRAM_ACCESS_TOKEN: str = ""
    INSTAGRAM_APP_ID: str = ""
    INSTAGRAM_APP_SECRET: str = ""
    INSTAGRAM_WEBHOOK_VERIFY_TOKEN: str = ""
    INSTAGRAM_API_VERSION: str = "v25.0"

    @field_validator("APP_ENV", mode="before")
    @classmethod
    def normalize_app_env(cls, value: Any) -> str:
        env = str(value or "development").strip().lower()
        aliases = {
            "dev": "development",
            "local": "development",
            "prod": "production",
        }
        env = aliases.get(env, env)
        allowed = {"development", "test", "staging", "production"}
        if env not in allowed:
            raise ValueError(
                "APP_ENV must be one of development, test, staging, or production"
            )
        return env

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value: Any) -> bool:
        if isinstance(value, bool):
            return value

        normalized = str(value).strip().lower()
        if normalized in {"1", "true", "t", "yes", "y", "on", "debug", "dev", "development", "local"}:
            return True
        if normalized in {"0", "false", "f", "no", "n", "off", "prod", "production", "staging", "test", "release"}:
            return False

        raise ValueError("DEBUG must be a boolean-like value such as true or false")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> list[str]:
        if isinstance(value, str):
            origins = [item.strip() for item in value.split(",") if item.strip()]
        elif isinstance(value, list):
            origins = [str(item).strip() for item in value if str(item).strip()]
        else:
            raise ValueError("CORS_ORIGINS must be a comma-separated string or list")

        if not origins:
            raise ValueError("CORS_ORIGINS must include at least one origin")

        for origin in origins:
            parsed = urlparse(origin)
            if origin == "*" or parsed.scheme not in {"http", "https"} or not parsed.netloc:
                raise ValueError(f"Invalid CORS origin: {origin}")

        return origins

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.APP_ENV != "production":
            return self

        required = [
            "SUPABASE_URL",
            "SUPABASE_SERVICE_ROLE_KEY",
            "SUPABASE_ANON_KEY",
            "JWT_SECRET",
            "RAZORPAY_KEY_ID",
            "RAZORPAY_KEY_SECRET",
            "RAZORPAY_WEBHOOK_SECRET",
            "WHATSAPP_PHONE_NUMBER_ID",
            "WHATSAPP_BUSINESS_ACCOUNT_ID",
            "WHATSAPP_ACCESS_TOKEN",
            "WHATSAPP_WEBHOOK_VERIFY_TOKEN",
            "WHATSAPP_APP_SECRET",
            "INSTAGRAM_BUSINESS_ACCOUNT_ID",
            "INSTAGRAM_ACCESS_TOKEN",
            "INSTAGRAM_APP_ID",
            "INSTAGRAM_APP_SECRET",
            "INSTAGRAM_WEBHOOK_VERIFY_TOKEN",
        ]
        missing = [name for name in required if not str(getattr(self, name, "")).strip()]
        if missing:
            raise ValueError(
                "Missing required production environment variables: "
                + ", ".join(missing)
            )
        return self

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
