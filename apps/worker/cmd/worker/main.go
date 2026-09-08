package main

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/zerochirou/worker/internal/config"
	"github.com/zerochirou/worker/internal/logger"
	"github.com/zerochirou/worker/internal/worker"
)

func main() {
	// 1. Load configuration
	cfg, err := config.Load()
	if err != nil {
		slog.Error("Failed to load configuration", slog.String("error", err.Error()))
		os.Exit(1)
	}

	// 2. Initialize structured logging
	logger.Init(cfg.AppEnv, cfg.LogLevel)

	slog.Info("Starting worker service",
		slog.String("app_name", cfg.AppName),
		slog.String("env", cfg.AppEnv),
	)

	// 3. Setup context with graceful shutdown on SIGINT & SIGTERM
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// 4. Initialize worker manager and register tasks
	mgr := worker.NewManager(cfg)
	mgr.Register(
		worker.NewHeartbeatTask(),
	)

	// 5. Run worker manager in background goroutine
	errChan := make(chan error, 1)
	go func() {
		if err := mgr.Start(ctx); err != nil && !errors.Is(err, context.Canceled) {
			errChan <- err
		}
		close(errChan)
	}()

	// 6. Wait for signal or runtime error
	select {
	case <-ctx.Done():
		slog.Info("Shutdown signal received, draining workers gracefully...")
	case err := <-errChan:
		if err != nil {
			slog.Error("Worker manager exited with error", slog.String("error", err.Error()))
		}
	}

	// 7. Cleanup grace period
	shutdownTimeout := 5 * time.Second
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer shutdownCancel()

	<-shutdownCtx.Done()
	slog.Info("Worker shutdown complete. Goodbye!")
}
