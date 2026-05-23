# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack content platform — a NestJS backend with a React frontend. The app supports user authentication, CRUD posts with tags/comments/likes, book tracking, and AI-powered features (chat, semantic search, image generation, RAG, git commit message generation) via LangChain.

## Repository Layout

```
browser-backend/browser/   — NestJS (v11) backend, uses pnpm
browser-frontend/browser/  — React (v19) frontend via Vite (v7), uses npm
```

Each subdirectory is a self-contained Node project. The backend and frontend are run independently.

## Commands

All commands below are run from the respective project root (`browser-backend/browser/` or `browser-frontend/browser/`).

### Backend (pnpm)

| Command | Purpose |
|---|---|
| `pnpm run start:dev` | Development server with hot reload (port 3000) |
| `pnpm run start:prod` | Production (run `node dist/main`) |
| `pnpm run build` | Build via Nest CLI |
| `pnpm run test` | Jest unit tests (files matching `*.spec.ts`) |
| `pnpm run test:e2e` | E2E tests (config in `test/jest-e2e.json`) |
| `pnpm run lint` | ESLint with auto-fix |
| `pnpm run format` | Prettier format |

Prisma:
- `npx prisma generate` — regenerate client after schema changes
- `npx prisma migrate dev` — create and apply migrations
- `npx prisma db seed` — seed the database (`prisma/seed.ts`)

### Frontend (npm)

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR (port 5173) |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build locally |

## Backend Architecture

The backend is a standard NestJS modular monolith:

- **`src/main.ts`** — entry point. Creates NestExpressApplication with `cors: true`, global prefix `/api`, global ValidationPipe, and static file serving from `uploads/` at `/uploads`.
- **`src/app.module.ts`** — root module, imports all feature modules.
- **`src/prisma/`** — database access module. `PrismaService` wraps Prisma client. Import `PrismaModule` in any module that needs DB access.
- **`src/auth/`** — JWT authentication via Passport. `JwtStrategy` extracts Bearer token. `JwtAuthGuard` protects routes. Login issues access + refresh tokens.
- **`src/ai/`** — LangChain-based AI service. Uses DeepSeek for chat (`deepseek-chat`), OpenAI for embeddings (`text-embedding-ada-002`) and DALL-E for image generation. Also includes RAG with in-memory vector store, semantic post search via cosine similarity, and git diff → commit message generation.
- **`src/posts/`**, **`src/comments/`**, **`src/likes/`**, **`src/users/`**, **`src/reading/`** — standard CRUD feature modules. Each module follows the NestJS pattern: controller → service → PrismaService.

Static data (`src/data/posts-embedding.json`) is copied to `dist/` during build via nest-cli.json assets config.

**Database**: PostgreSQL accessed via Prisma ORM. Schema at `prisma/schema.prisma`. Key entities: User, Post, Comment (self-referencing tree), Tag (many-to-many via PostTag), Book (tracked via UserBook join), File (with image dimensions), Avatar.

## Frontend Architecture

- **Vite** with `@vitejs/plugin-react`, `@tailwindcss/vite`, and `vite-plugin-mock` (serves mock APIs from `mock/` directory in dev).
- **`@/` alias** maps to `src/` (configured in both `tsconfig.json` paths and `vite.config.ts` resolve.alias).
- **Routing** via `react-router-dom` v7 in `src/router/index.tsx`. Routes are lazy-loaded. `ProtectedRoute` wraps authenticated pages, redirects to `/login` if not logged in. `MainLayout` provides bottom navigation shell. `AliveScope` (react-activation) enables keep-alive on the home page.
- **State management** — Zustand with `persist` middleware. Stores are in `src/store/`. `useUserStore` persists auth tokens to localStorage. Domain stores: `home.ts`, `reading.ts`, `search.ts`, `SmartReading.ts`, `git.ts`, `rag.ts`, `RoleWorkshop.ts`.
- **API layer** — `src/api/config.ts` creates an axios instance (`baseURL: http://localhost:3000/api`) with request interceptor (attaches JWT Bearer) and response interceptor (catches 401s, queues concurrent requests, silently refreshes token, retries). Other API files import this configured instance.
- **UI components** — shadcn/ui (New York style), Tailwind CSS v4 with `tw-animate-css`. Components live in `src/components/ui/`.
- **Types** — shared TypeScript interfaces in `src/types/index.ts`: `User`, `Post`, `Credentail` (sic).

## Key Conventions

- Prettier config: single quotes, trailing commas (`"all"`).
- Backend modules use `pnpm`, frontend uses `npm` — do not mix package managers.
- Backend global API prefix is `/api`; frontend axios base URL points to `http://localhost:3000/api`. When developing, run both servers concurrently.
- The backend `.env` file is gitignored — it requires `DATABASE_URL`, `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `TOKEN_SECRET`, and `PORT` (optional).
