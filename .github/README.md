# Project Trinetra — Local Setup

This README is a comprehensive, step-by-step manual to run Project Trinetra locally with zero errors on Windows, macOS, or Linux. It codifies the exact stack and settings we use in development:

- Python 3.12.4 (via pyenv/pyenv-win)
- FastAPI backend with PostgreSQL 17, Qdrant (Cloud or Local), and Ollama (Qwen 2.5 7B Instruct)
- React + TypeScript + Vite frontend
- Optional Dockerized backend for reproducibility

If you follow the instructions exactly, you should be able to clone, configure, and run the project end-to-end, including:
- Uploading PDF/DOCX documents
- Parsing + OCR fallback for scanned pages
- AI insights: summary, classification, targeted extraction
- Semantic search across your ingested document chunks

---

## Contents

- [1. Repository Layout](#1-repository-layout)
- [2. Prerequisites](#2-prerequisites)
- [3. Python 3.12.4 via pyenv/pyenv-win](#3-python-3124-via-pyenvpyenv-win)
- [4. PostgreSQL 17 Setup (Least-Privilege Role)](#4-postgresql-17-setup-least-privilege-role)
- [5. Qdrant Setup (Choose Cloud or Local)](#5-qdrant-setup-choose-cloud-or-local)
- [6. Ollama Setup (Local LLM)](#6-ollama-setup-local-llm)
- [7. Backend Setup](#7-backend-setup)
- [8. Frontend Setup](#8-frontend-setup)
- [9. Run Everything](#9-run-everything)
- [10. API Reference (Quick Start)](#10-api-reference-quick-start)
- [11. Troubleshooting & Common Errors](#11-troubleshooting--common-errors)
- [12. Advanced: Dockerized Backend](#12-advanced-dockerized-backend)
- [13. Known Limitations (MVP)](#13-known-limitations-mvp)
- [14. Contributing](#14-contributing)
- [15. License](#15-license)

---

## 1. Repository Layout

```
project-trinetra/
├─ backend/
│  ├─ app/
│  │  ├─ api/                # FastAPI routers: /healthz, /documents, /search
│  │  ├─ core/               # Config, settings, model registry
│  │  ├─ db/                 # SQLAlchemy models, migrations, engine
│  │  ├─ services/           # Parsing, OCR, chunking, embeddings, vector store, LLM clients
│  │  ├─ schemas/            # Pydantic schemas (request/response)
│  │  └─ main.py             # FastAPI entrypoint
│  ├─ storage/               # Uploaded files (PDF/DOCX)
│  ├─ requirements.txt
│  ├─ Dockerfile             # Multi-stage build, non-root, Python 3.12 slim
│  └─ .env                   # Backend environment variables
├─ frontend/
│  ├─ src/                   # React + TypeScript + Vite source
│  ├─ public/                # Static assets
│  ├─ package.json
│  └─ vite.config.ts         # Vite configuration file
│  
├─ .github/
│  ├─ CODEOWNERS             # GitHub code ownership rules
│  └─ README.md              # This file
├─ .gitignore
└─ .python-version           # Specifies the Python version for tooling
```

---

## 2. Prerequisites

- Git
- Node.js ≥ 18 and npm ≥ 9
- Python 3.12.4 (via pyenv/pyenv-win recommended)
- PostgreSQL 17
- Ollama (local LLM runtime)
- Qdrant (choose Cloud OR run Local via Docker)
- Docker (optional, for running the backend container)

OS-specific:
- Windows: PowerShell recommended. Make sure “Developer Mode” is enabled to allow symlinks (improves Hugging Face model caching), or run terminals as Administrator.
- macOS/Linux: Any standard terminal is fine.

---

## 3. Python 3.12.4 via pyenv/pyenv-win

Install and select Python 3.12.4 for this project (do not use 3.13 yet).

- Linux/macOS:
  ```bash
  pyenv install 3.12.4
  pyenv local 3.12.4
  ```
- Windows (pyenv-win):
  ```powershell
  pyenv install 3.12.4
  pyenv local 3.12.4
  ```

This pins the interpreter for the repo only.

---

## 4. PostgreSQL 17 Setup (Least-Privilege Role)

1) Start/ensure PostgreSQL 17 is running on localhost:5432.

2) Create the application role and schema (Windows paths shown; adjust as needed):

- Connect as superuser:
  ```powershell
  "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d postgres
  ```

- Run these SQL statements:
  ```sql
  -- Create least-privilege login role
  CREATE ROLE trinetra_app WITH LOGIN PASSWORD 'YOUR_STRONG_PASSWORD'
    NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;

  -- Allow connection to the database (ensure the DB exists)
  GRANT CONNECT ON DATABASE trinetra_db TO trinetra_app;

  -- Switch database
  \c trinetra_db

  -- Create dedicated schema owned by the app role
  CREATE SCHEMA IF NOT EXISTS trinetra AUTHORIZATION trinetra_app;

  -- Set default search_path
  ALTER DATABASE trinetra_db SET search_path TO trinetra, public;

  -- (Optional) Make the app user owner of the DB
  ALTER DATABASE trinetra_db OWNER TO trinetra_app;
  ```

3) Verify:
```sql
\du
\dn+
```

Tip (Windows passwords): If your password contains special characters (@:/?#&= etc.), you must URL-encode it when placing in a DB connection string. See Troubleshooting.

---

## 5. Qdrant Setup (Choose Cloud or Local)

You must pick exactly one for your environment:

A) Qdrant Cloud (recommended for persistence and simplicity)
- Create a free cluster (1 GB tier).
- Get:
  - QDRANT_URL (cluster HTTPS endpoint)
  - QDRANT_API_KEY (token)
- Test:
  ```bash
  curl -H "api-key: <QDRANT_API_KEY>" "<QDRANT_URL>/readyz"
  ```

B) Local Qdrant (Docker)
```bash
docker rm -f trinetra-qdrant 2>/dev/null || true
docker run -d --name trinetra-qdrant -p 6333:6333 qdrant/qdrant:v1.9.1
curl http://localhost:6333/readyz
```

You’ll point the backend .env to either Cloud or Local in the next section.

---

## 6. Ollama Setup (Local LLM)

1) Install Ollama: https://ollama.com/download

2) Pull the model we use by default:
```bash
ollama pull qwen2.5:7b-instruct
```

3) Verify the model is installed and the server is listening:
```bash
curl -s http://localhost:11434/api/tags
ollama run qwen2.5:7b-instruct -p "Reply with only: {\"ok\":true}"
```

Note:
- We do NOT need a vision model (e.g., LLaVA or Qwen-VL) for the MVP/right now. (Will work on it if time permits)
- Keep Ollama local (no network exposure) unless you containerize the backend and need cross-host access.

---

## 7. Backend Setup

1) Create a virtual environment and install dependencies:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\Activate.ps1
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

2) Create and populate `backend/.env`:

```env

VITE_API_BASE=http://localhost:8000

# Database (native PostgreSQL 17 example)
DB_URL=postgresql+psycopg2://trinetra_app:URL_ENCODED_PASSWORD@localhost:5432/trinetra_db

# Qdrant
# For cloud Qdrant: set both QDRANT_URL and QDRANT_API_KEY.
QDRANT_URL=https://YOUR-CLOUD-CLUSTER.qdrant.io
QDRANT_API_KEY=YOUR_QDRANT_API_KEY

# If you want to run local Qdrant instead, leave QDRANT_API_KEY empty and set QDRANT_URL=http://localhost:6333

# LLM runtime selection: ollama | vllm
LLM_RUNTIME=ollama

# Ollama (local). Do NOT expose to network unless necessary.
OLLAMA_URL=http://localhost:11434
MODEL_NAME=qwen2.5:7b-instruct-q4_K_M

# vLLM (optional later)
#VLLM_BASE_URL=http://localhost:8000/v1
#VLLM_API_KEY=
#VLLM_MODEL_ID=Qwen/Qwen2.5-7B-Instruct-AWQ

# Storage directory for original files
STORAGE_DIR=./storage

# Embedding model
EMBEDDING_MODEL=intfloat/multilingual-e5-base

# Chunking
CHUNK_SIZE=2000
CHUNK_OVERLAP=200
QDRANT_TIMEOUT=120
QDRANT_BATCH_SIZE=64
TEXT_SNIPPET_CHARS=500

# LLM tuning
LLM_TEMPERATURE=0.1
LLM_TOP_P=0.9
LLM_MAX_TOKENS=1024

# Ollama runtime options
# Larger num_ctx improves long-doc coherence; keep conservative for 7B on 8GB VRAM.
OLLAMA_NUM_CTX=4096
OLLAMA_NUM_PREDICT=800
```

3) Start the backend (auto-creates tables):
```bash
uvicorn app.main:app --reload
```

4) Health check:
```bash
# Expect db:true, qdrant:true, llm.ok:true
curl http://localhost:8000/healthz
```

Windows password encoding tip:
- If your DB password has special characters, encode it:
  ```python
  from urllib.parse import quote_plus
  print(quote_plus("MyStr@ng:P@ss/word"))
  ```
  Then use the encoded string in `DB_URL`.

Optional (OCR on Windows):
- For OCR on scanned PDFs, install Tesseract separately if you’re running outside Docker:
  - Windows: https://github.com/UB-Mannheim/tesseract/wiki
  - Add to PATH and install languages: English (`eng`), Malayalam (`mal`).

---

## 8. Frontend Setup

1) Install and run:
```bash
cd frontend
npm install
npm run dev
```

2) Open the app:
- http://localhost:5173

---

## 9. Run Everything

- Start PostgreSQL 17, Ollama, and (Cloud or Local) Qdrant.
- Backend:
  ```bash
  cd backend
  # activate venv…
  uvicorn app.main:app --reload
  ```
- Frontend:
  ```bash
  cd frontend
  npm run dev
  ```
- Test upload (use the UI):
  - Upload PDF/DOCX
  - View summary, classification, extraction
  - Try semantic search queries

---

## 10. API Reference (Quick Start)

- GET `/healthz`
  - Returns: `{ ok: boolean, db: boolean, qdrant: boolean, llm: { ok: boolean, detail: string } }`

- POST `/documents/upload`
  - multipart/form-data with `file` (.pdf or .docx)
  - Returns: `{ doc_id, filename, page_count, ocr_applied, language_primary }`

- GET `/documents/{doc_id}`
  - Returns: DocumentResponse with summary, classification, extraction, and page metadata

- GET `/search?query=...&k=10`
  - Returns: SearchResponse with hits and text snippets

Example (PowerShell):
```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8000/healthz
```

---

## 11. Troubleshooting & Common Errors

- 404 from `http://localhost:11434/api/generate`
  - The Ollama model isn’t installed. Run: `ollama pull qwen2.5:7b-instruct`. Verify via `/api/tags`.

- Qdrant “actively refused” or timeouts
  - Cloud: ensure `QDRANT_URL` and `QDRANT_API_KEY` are correct. `curl -H "api-key: ..." <url>/readyz`
  - Local: ensure the container is running: `docker ps`, and `QDRANT_URL=http://localhost:6333` with empty API key.

- PostgreSQL authentication failures
  - Ensure `DB_URL` uses the `trinetra_app` role and correct password.
  - If password has special characters, URL-encode it.
  - Confirm DB is reachable:
    ```powershell
    "C:\Program Files\PostgreSQL\17\bin\psql.exe" "postgresql://trinetra_app:ENCODED_PASS@localhost:5432/trinetra_db" -c "SELECT current_user, current_schema;"
    ```

- Windows Hugging Face cache symlink warning
  - Harmless. Optional: enable Windows “Developer Mode”, or set `HF_HUB_DISABLE_SYMLINKS_WARNING=1`.

- OCR not working (scanned PDFs)
  - If not using Docker, you must install Tesseract locally and ensure `eng` and `mal` language packs are available.

- Ports already in use
  - Change ports in Vite config or stop conflicting services (`netstat -ano` on Windows).

- Slow uploads to Qdrant Cloud
  - We batch upserts and only store snippets; you can tune:
    - `QDRANT_TIMEOUT` (e.g., 90)
    - `QDRANT_BATCH_SIZE` (e.g., 64)

---

## 12. Advanced: Dockerized Backend

For reproducibility, you can run the backend as a container while keeping native PostgreSQL and Ollama:

1) Build:
```powershell
# from repo root
docker build -t trinetra-backend:dev backend
```

2) Windows/macOS: use `host.docker.internal` in backend/.env for DB and Ollama:
```
DB_URL=postgresql+psycopg2://trinetra_app:ENCODED_PASS@host.docker.internal:5432/trinetra_db
OLLAMA_URL=http://host.docker.internal:11434
```

3) Run:
```powershell
docker run --rm -p 8000:8000 `
  --env-file backend\.env `
  --mount type=bind,source="$PWD\backend\storage",target=/app/storage `
  trinetra-backend:dev
```

Cloud Qdrant continues to work unchanged. For Local Qdrant inside Docker, map ports as shown in section 5.

Security notes (container):
- Non-root user (UID 1001)
- Multi-stage build (reduced attack surface)
- Only runtime deps in final image
---

## 13. Known Limitations (MVP)

- OCR is basic (Tesseract) and not tuned for heavy layout/table recognition.
- No image captioning/VLM (LLaVA/Qwen-VL) in MVP; planned behind a feature flag.
- Table extraction from invoices/contracts is out-of-scope for MVP (we extract key fields only).
- Model outputs can vary; we enforce strict JSON and use retrieval-guided prompts to improve reliability.

---

## 14. Contributing

- Branch off `main` and submit PRs.
- Keep commits scoped and well-described.
- Add tests where feasible (unit tests for parsing/chunking; smoke tests for API routes).
- Use linting/formatting conventions (black/isort/ruff if configured).

---

## 15. License

TBD.

---

## Quick Verification Checklist

- [ ] Python 3.12.4 selected via pyenv/pyenv-win
- [ ] PostgreSQL 17: `trinetra_app` role + `trinetra` schema created; `DB_URL` correct (password URL-encoded if needed)
- [ ] Qdrant Cloud or Local reachable (readyz OK)
- [ ] Ollama running; `qwen2.5:7b-instruct` installed; `/api/tags` lists it
- [ ] Backend: `/healthz` shows `db:true`, `qdrant:true`, `llm.ok:true`
- [ ] Frontend connected to backend; upload, insights, and search work

If any step fails, see Troubleshooting or open an issue with logs and your `/healthz` JSON.

Happy building!