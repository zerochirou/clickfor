.PHONY: dev build run test lint clean

# Run with air (live-reload) if available, otherwise go run
dev:
	@if command -v air >/dev/null 2>&1; then \
		air; \
	else \
		go run cmd/worker/main.go; \
	fi

# Build binary
build:
	@mkdir -p dist
	go build -ldflags="-s -w" -o dist/worker cmd/worker/main.go

# Run built binary
run: build
	./dist/worker

# Run tests
test:
	go test -v -race ./...

# Run static analysis
lint:
	go vet ./...

# Clean artifacts
clean:
	rm -rf dist bin tmp
