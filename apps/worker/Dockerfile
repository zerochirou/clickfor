# Multi-stage Dockerfile for Go Worker in apps/worker
# ------------------------------------------------------------------------------
# Stage 1: Builder
# ------------------------------------------------------------------------------
FROM golang:1.26-alpine AS builder

WORKDIR /build

RUN apk add --no-cache git ca-certificates

# Copy dependency files first for layer caching
COPY apps/worker/go.mod apps/worker/go.sum ./
RUN go mod download

# Copy worker source code
COPY apps/worker/cmd/ ./cmd/
COPY apps/worker/internal/ ./internal/

# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /build/bin/worker ./cmd/worker/main.go

# ------------------------------------------------------------------------------
# Stage 2: Runner (Minimal Production Image)
# ------------------------------------------------------------------------------
FROM alpine:3.21 AS runner

RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /build/bin/worker /app/worker

USER appuser

CMD ["/app/worker"]
