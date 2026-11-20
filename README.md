# PaperChat AI

Chat with your PDFs using Retrieval-Augmented Generation (RAG). Upload documents, ask questions, and get answers grounded in your files.

## Features

- Upload PDFs and ask questions about them
- Local CPU embeddings with FastEmbed (ONNX, no PyTorch needed)
- Answers from Google Gemini via LangChain and LangGraph
- User authentication with access and refresh tokens
- Persistent chat history
- Light and dark mode

## Tech stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** FastAPI, SQLAlchemy, LangChain, LangGraph
- **Database:** SQLite by default (any SQLAlchemy URL works via `DATABASE_URL`)
- **Vector store:** Chroma (local, persistent)
- **Models:** Google Gemini + `sentence-transformers/all-MiniLM-L6-v2` (FastEmbed)

## Requirements

- Python 3.12+ and [uv](https://docs.astral.sh/uv/)
- Node.js 20+ and npm
- A [Google Gemini API key](https://aistudio.google.com/)

## Setup

### 1. Clone

```bash
git clone https://github.com/04rjka/paperchat-ai.git
cd paperchat-ai
```

### 2. Backend

```bash
uv sync
```

Create `backend/.env`:

```dotenv
GOOGLE_API_KEY=your_gemini_api_key
SECRET_KEY=a_long_random_string
LLM_MODEL=gemini-2.5-flash
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Create the database tables, then start the API (run both from the project root):

```bash
uv run python backend/init_db.py
uv run python backend/main.py
```

API: `http://localhost:8000` · Docs: `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

In development, the frontend proxies `/api/v1/*` to `http://localhost:8000` automatically. To use a different backend URL, or for production builds (where it's required), create `frontend/.env.local`:

```dotenv
FASTAPI_URL=http://your-backend-url
```

## Usage

1. Sign up and log in.
2. Upload a PDF.
3. Ask questions about it in the chat.

## Configuration

Backend variables (`backend/.env`):

| Variable | Required | Default |
| --- | --- | --- |
| `GOOGLE_API_KEY` | Yes | - |
| `SECRET_KEY` | Yes | - |
| `LLM_MODEL` | No | `gemini-2.5-flash` |
| `EMBEDDING_MODEL` | No | `sentence-transformers/all-MiniLM-L6-v2` |
| `DATABASE_URL` | No | SQLite at `backend/storage/app.db` |
| `CHROMA_PATH` | No | `backend/storage/chroma` |
| `UPLOAD_PATH` | No | `backend/storage/uploads` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | `7` |
| `CORS_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` |

Frontend variable (`frontend/.env.local`):

| Variable | Required | Default |
| --- | --- | --- |
| `FASTAPI_URL` | Production only | `http://localhost:8000` in development |

## Project structure

```text
backend/
  app/        Config, routers, services, auth, RAG pipeline (FastAPI app in app/app.py)
  storage/    SQLite DB, uploaded PDFs, Chroma data (auto-created, not committed)
  init_db.py  Creates the database tables
  main.py     Runs the server with uvicorn
frontend/
  app/        Pages and layouts
  components/ UI and chat components
  lib/        API client and utilities
```

## Notes

- Never commit `.env` files or `backend/storage/`.
- On first use, FastEmbed downloads the embedding model (~90 MB) and caches it. Later runs work offline.

## Changing models

- **Chat model:** set `LLM_MODEL` in `backend/.env` and restart the backend.
- **Embedding model:** set `EMBEDDING_MODEL`, delete `backend/storage/chroma`, and re-upload your PDFs. Vectors from different embedding models are not compatible.

## Troubleshooting

- **First upload is slow:** the embedding model is downloading. This only happens once.
- **Gemini errors:** check that `GOOGLE_API_KEY` is valid and has quota.
- **Frontend can't reach the API:** make sure the backend is running on port 8000, or set `FASTAPI_URL` in `frontend/.env.local`. Production builds fail without it.
- **CORS errors:** make sure your frontend URL is listed in `CORS_ORIGINS` in `backend/.env`.
- **Start fresh:** `rm -rf backend/storage` (deletes the database, uploads, and vectors), then run `init_db.py` again.

## License

MIT