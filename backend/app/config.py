from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
STORAGE_DIR = BACKEND_ROOT / "storage"

# Create storage directories
(STORAGE_DIR / "chroma").mkdir(parents=True, exist_ok=True)
(STORAGE_DIR / "uploads").mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    #API Keys
    google_api_key:str

    # Models
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    llm_model: str = "gemini-2.5-flash"

    # Storage
    chroma_path: str = str(STORAGE_DIR / "chroma")
    upload_path: str = str(STORAGE_DIR / "uploads")
    database_url: str = f"sqlite:///{STORAGE_DIR / 'app.db'}"

    #Auth
    secret_key: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Server
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    model_config = SettingsConfigDict(
        env_file= BACKEND_ROOT / ".env",
        extra="ignore",
    )

settings = Settings()