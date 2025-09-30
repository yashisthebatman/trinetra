# Multi-stage secure-ish build for Python 3.12 with OCR support.
# Goals:
#  - Use a recent stable Python (3.12) with wide wheel availability.
#  - Reduce attack surface (remove build deps in final image).
#  - Non-root execution.
#  - Layer minimization & cache efficiency.

# ---- Stage 1: builder ----
FROM python:3.12-slim AS builder

ENV DEBIAN_FRONTEND=noninteractive \
    PIP_NO_CACHE_DIR=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies for building wheels & OCR
# (We will remove build-essential from final runtime.)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-mal \
        qpdf \
        ghostscript \
        libjpeg-dev \
        zlib1g-dev \
        libpng-dev \
        libfreetype6-dev \
        libharfbuzz-dev \
        libfribidi-dev \
        libxcb1 \
        curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies first (to leverage layer caching)
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app ./app

# ---- Stage 2: runtime ----
FROM python:3.12-slim AS runtime

ENV DEBIAN_FRONTEND=noninteractive \
    PIP_NO_CACHE_DIR=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install only runtime deps (omit build-essential)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-mal \
        qpdf \
        ghostscript \
        libjpeg62-turbo \
        zlib1g \
        libpng16-16 \
        libfreetype6 \
        libharfbuzz0b \
        libfribidi0 \
        libxcb1 && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 trinetra

WORKDIR /app

# Copy installed site-packages & application from builder
COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app/app ./app

# Create storage directory with proper permissions
RUN mkdir -p /app/storage && chown -R trinetra:trinetra /app

USER trinetra

EXPOSE 8000

# Optional healthcheck example:
# HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import socket; s=socket.socket(); s.connect(('127.0.0.1',8000))"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]