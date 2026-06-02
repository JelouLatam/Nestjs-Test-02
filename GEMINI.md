# NestJS Todo - Project Guidelines

Purpose
- Build a dockerized NestJS backend for a todo app implementing CRUD, auth, logging, caching, rate-limiting and observability.
- Acceptance criteria: all required endpoints work, project runs in Docker compose, unit+integration tests >= 80% coverage, linter passes.

Project layout (mapping)
- src/app.module.ts — root wiring
- src/modules/tasks/* — Tasks controller, service, DTOs, entity/repository
- src/modules/auth/* — JWT auth and guards
- src/modules/logging/* — Winston transports (file + Mongo)
- src/common/* — guards, interceptors, middleware, shared DTOs
- src/config/config.service.ts — env configuration
- test/unit & test/integration — tests


Required features (explicit)
- Endpoints:
  - POST /tasks — create task (body: title, description?, status?)
  - GET /tasks — list tasks, supports ?status=completed|pending, ?page, ?limit
  - GET /tasks/:id — get by id
  - PUT /tasks/:id — update title/description/status
  - DELETE /tasks/:id — delete
  - Auth: JWT-protected endpoints (except signup/login)
- Behavior:
  - Pagination when >10 tasks; default limit=10, page=1
  - Completed/pending counter in list response
  - Input validation via DTOs (class-validator)
  - Rate limit (e.g. 100 req/min) configurable via env
  - Cache GET /tasks with Redis; invalidate on mutations
- Logging:
  - HTTP request logging middleware -> file transport
  - App logs (errors/events) -> MongoDB via Winston transport
- Metrics:
  - Simple metrics endpoint (/metrics) for Prometheus scrape
- Database:
  - MySQL for tasks persistence; migrations in src/database/migrations


Environment variables (example)
- PORT, NODE_ENV
- JWT_SECRET, JWT_EXPIRES_IN
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB
- REDIS_HOST, REDIS_PORT
- MONGO_URI
- RATE_LIMIT_TTL, RATE_LIMIT_MAX

Docker & Compose
- Provide Dockerfile for app image.
- docker-compose.yml must include services: app, mysql, redis, mongo (for logs).
- Instructions: build, migrate, start.

Testing & CI
- Unit tests for services/controllers; integration tests run against test containers or docker-compose test stack.
- Coverage target >= 80% (report to output).
- Add lint (ESLint) and Prettier checks; fail CI on lint/type errors.

README additions (to include)
- Quick start (local + docker-compose)
- Env file example and required variables
- How to run migrations and seeds
- How to run tests and see coverage
- Sample curl requests for each endpoint with expected responses
- Branch naming rule: test/your-name

Sample API responses (minimal)
- GET /tasks:
  {
    "items": [{ "id": 1, "title": "t", "description": "", "status": "pending" }],
    "meta": { "total": 42, "page": 1, "limit": 10, "completed": 10, "pending": 32 }
  }

Notes for reviewers
- Keep controllers thin; put business logic in services.
- Use DI and interfaces where useful for testability (e.g., repository abstraction).
- Ensure sensitive data stays in env, not committed.

Checklist for submission
- [ ] Dockerfile + docker-compose.yml included and working
- [ ] Endpoints implemented and documented
- [ ] JWT auth implemented and protecting endpoints
- [ ] Logging to file and Mongo configured
- [ ] Redis caching for GET /tasks
- [ ] Rate limiting in place
- [ ] Unit + integration tests with >=80% coverage
- [ ] README with run instructions and sample requests


current directory:
/nestjs-todo-test
├── src/
│   ├── app.module.ts            # Root module
│   ├── main.ts                  # Application entry point
│   │
│   ├── modules/                 # Feature-based modules
│   │   ├── auth/                # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.strategy.ts  # JWT strategy file
│   │   │
│   │   ├── tasks/               # Task management module
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.dto.ts     # DTOs for input validation
│   │   │   ├── tasks.entity.ts  # Entity/Model definition
│   │   │   └── tasks.repository.ts # Optional, for clean data access
│   │   │
│   │   └── logging/             # Logging module
│   │       ├── logging.module.ts
│   │       ├── logging.service.ts
│   │       └── transports/      # Winston transports
│   │           ├── file.transport.ts
│   │           └── mongo.transport.ts
│   │
│   ├── common/                  # Shared components
│   │   ├── filters/             # Exception filters
│   │   ├── guards/              # Guards (e.g., AuthGuard)
│   │   ├── interceptors/        # Interceptors (e.g., Caching, Logging)
│   │   ├── middleware/          # Middleware (e.g., request logger)
│   │   └── dtos/                # Reusable DTOs
│   │       └── pagination.dto.ts
│   │
│   ├── config/                  # Configuration files
│   │   └── config.service.ts    # Service to handle env variables
│   │
│   └── database/                # Database-related files
│       └── migrations/          # TypeORM migrations
│
├── test/                        # Tests directory
│   ├── unit/                    # Unit tests
│   │   └── tasks.service.spec.ts
│   │
│   └── integration/             # Integration tests
│       └── tasks.e2e-spec.ts
│
├── .env.example                 # Example environment variables
├── .eslintrc.js                 # ESLint configuration
├── .gitignore
├── .prettierrc                  # Prettier configuration
├── docker-compose.yml           # Docker Compose file
├── Dockerfile                   # Dockerfile for the app
├── package.json
└── README.md
