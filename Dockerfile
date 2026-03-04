# syntax=docker/dockerfile:1.4
# Builds Frappe v16 + LMS from scratch.
# No dependency on ghcr.io images — works offline-first.

FROM python:3.14-slim-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl mariadb-client libmariadb-dev-compat \
    libffi-dev libssl-dev libjpeg-dev libpng-dev \
    liblcms2-dev libwebp-dev \
    build-essential gettext-base cron pkg-config \
    && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

# Install frappe-bench CLI
RUN pip install --no-cache-dir frappe-bench

# Create frappe user
RUN useradd -ms /bin/bash frappe

USER frappe
WORKDIR /home/frappe

# Initialise bench with Frappe v16 (clones frappe from GitHub + installs deps)
RUN bench init \
    --frappe-branch version-16 \
    --skip-redis-config-generation \
    --no-procfile \
    frappe-bench

WORKDIR /home/frappe/frappe-bench

# Install LMS app
RUN bench get-app --branch main https://github.com/frappe/lms

EXPOSE 8000
CMD ["bench", "serve", "--port", "8000"]
