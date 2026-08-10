# Pulse — Uptime Monitor

## Prerequisites

- [Bun](https://bun.sh) installed
- [Docker](https://www.docker.com/) installed and running

## Setup

### 1. Start Postgres and Redis

```bash
docker compose up -d
docker compose ps  
```

### 2. Install dependencies

```bash
bun install
```

### 3. Create environment files

Each app reads its own `.env` file — copy the values below, adjusting
the Postgres/Redis ports if `docker compose ps` shows different ones
than the defaults (`5432` / `6379`) due to a local port conflict.

**`packages/store/.env`**
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
```

**`apps/api/.env`**
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
JWT_SECRET=<any random string>
PORT=3001
```

**`apps/worker/.env`**
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
REDIS_URL=redis://localhost:6379
REGION_ID=<see step 5>
WORKER_ID=worker-1
```

**`apps/pusher/.env`**
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
REDIS_URL=redis://localhost:6379
```

**`apps/web/.env.local`** (copy from `.env.local.example`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Run database migrations

```bash
cd packages/store
bunx prisma generate
bunx prisma migrate deploy
```

### 5. Seed a region

```bash
bun run seed
```

This prints a region ID:
```
Created region "India" -> id: <uuid>
```

Copy that UUID into `REGION_ID` in `apps/worker/.env` (step 3).

### 6. Create the Redis consumer group

```bash
cd ../redisstream
REDIS_URL=redis://localhost:6379 REGION_ID=<uuid-from-step-5> bun run setup
```

(On Windows PowerShell: `$env:REDIS_URL="..."; $env:REGION_ID="..."; bun run setup`)

### 7. Run everything

```bash
cd ../..
bun run dev
```