# Clickfor Worker

Background worker service written in Go for asynchronous job processing, scheduled tasks, and event consumers.

## Tech Stack

- **Go**: 1.26+
- **Logging**: `log/slog` (Go standard library structured logger)
- **Live Reload**: `air` (falls back to `go run` if not installed)
- **Config**: `.env` loader with fallback environment variable resolution (`github.com/joho/godotenv`)
- **Graceful Shutdown**: Context-driven signal listening for `SIGINT` and `SIGTERM`

## Project Structure

```text
apps/worker/
├── cmd/
│   └── worker/
│       └── main.go          # Service entrypoint & graceful shutdown
├── internal/
│   ├── config/              # Environment config loader
│   ├── logger/              # Structured logging configuration
│   └── worker/              # Worker engine, concurrency manager, & tasks
│       ├── task.go          # Task interface & sample implementations
│       ├── task_test.go     # Unit tests
│       └── worker.go        # Batch & concurrency scheduler
├── .air.toml                # Air live-reload configuration
├── .env.example             # Template environment variables
├── Makefile                 # CLI commands (build, run, test, lint)
├── package.json             # Monorepo / Turborepo integration
└── go.mod                   # Go module definitions
```

## Running the Service

### Via Turborepo / pnpm (From repository root)

```bash
# Start development mode (watches changes with Air)
pnpm --filter worker dev

# Build binary
pnpm --filter worker build

# Run tests
pnpm --filter worker test

# Run linter
pnpm --filter worker lint
```

### Via Makefile (Inside `apps/worker`)

```bash
# Development with hot reload
make dev

# Build binary to dist/worker
make build

# Run tests
make test

# Run linter
make lint

# Run binary
make run
```
