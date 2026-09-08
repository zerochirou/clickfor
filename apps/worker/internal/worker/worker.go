package worker

import (
	"context"
	"log/slog"
	"sync"
	"time"

	"github.com/zerochirou/worker/internal/config"
)

// Manager coordinates background worker routines and tasks.
type Manager struct {
	cfg   *config.Config
	tasks []Task
}

// NewManager creates a new worker manager.
func NewManager(cfg *config.Config) *Manager {
	return &Manager{
		cfg:   cfg,
		tasks: make([]Task, 0),
	}
}

// Register adds one or more tasks to the manager.
func (m *Manager) Register(tasks ...Task) {
	m.tasks = append(m.tasks, tasks...)
}

// Start runs the worker loop until the context is cancelled.
func (m *Manager) Start(ctx context.Context) error {
	slog.Info("Worker manager started",
		slog.Int("registered_tasks", len(m.tasks)),
		slog.Duration("poll_interval", m.cfg.PollInterval),
		slog.Int("concurrency", m.cfg.WorkerConcurrency),
	)

	ticker := time.NewTicker(m.cfg.PollInterval)
	defer ticker.Stop()

	// Run tasks immediately on startup once
	m.runBatch(ctx)

	for {
		select {
		case <-ctx.Done():
			slog.Info("Context cancelled, stopping worker manager loop")
			return ctx.Err()
		case <-ticker.C:
			m.runBatch(ctx)
		}
	}
}

func (m *Manager) runBatch(ctx context.Context) {
	if len(m.tasks) == 0 {
		return
	}

	var wg sync.WaitGroup
	// Semaphore channel to bound concurrency
	sem := make(chan struct{}, m.cfg.WorkerConcurrency)

	for _, task := range m.tasks {
		select {
		case <-ctx.Done():
			slog.Warn("Context done before task could start", slog.String("task", task.Name()))
			return
		case sem <- struct{}{}:
			wg.Add(1)
			go func(t Task) {
				defer func() {
					<-sem
					wg.Done()
				}()

				// Guard against panic in worker task
				defer func() {
					if r := recover(); r != nil {
						slog.Error("Recovered from panic in task",
							slog.String("task", t.Name()),
							slog.Any("panic", r),
						)
					}
				}()

				start := time.Now()
				if err := t.Execute(ctx); err != nil {
					slog.Error("Task execution failed",
						slog.String("task", t.Name()),
						slog.String("error", err.Error()),
						slog.Duration("duration", time.Since(start)),
					)
					return
				}

				slog.Debug("Task executed successfully",
					slog.String("task", t.Name()),
					slog.Duration("duration", time.Since(start)),
				)
			}(task)
		}
	}

	wg.Wait()
}
