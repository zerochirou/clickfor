package worker

import (
	"context"
	"log/slog"
	"time"
)

// Task defines the interface for an executable background task.
type Task interface {
	Name() string
	Execute(ctx context.Context) error
}

// HeartbeatTask is a sample periodic task demonstrating worker execution.
type HeartbeatTask struct{}

func NewHeartbeatTask() *HeartbeatTask {
	return &HeartbeatTask{}
}

func (t *HeartbeatTask) Name() string {
	return "heartbeat"
}

func (t *HeartbeatTask) Execute(ctx context.Context) error {
	slog.Info("Executing heartbeat task",
		slog.String("task", t.Name()),
		slog.Time("timestamp", time.Now()),
	)
	return nil
}
