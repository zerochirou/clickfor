package worker_test

import (
	"context"
	"testing"
	"time"

	"github.com/zerochirou/worker/internal/config"
	"github.com/zerochirou/worker/internal/worker"
)

type mockTask struct {
	executed bool
}

func (m *mockTask) Name() string {
	return "mock_task"
}

func (m *mockTask) Execute(ctx context.Context) error {
	m.executed = true
	return nil
}

func TestHeartbeatTask(t *testing.T) {
	task := worker.NewHeartbeatTask()
	if task.Name() != "heartbeat" {
		t.Fatalf("expected task name 'heartbeat', got %s", task.Name())
	}

	ctx := context.Background()
	if err := task.Execute(ctx); err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
}

func TestWorkerManager_StartAndCancel(t *testing.T) {
	cfg := &config.Config{
		AppEnv:            "test",
		AppName:           "test-worker",
		LogLevel:          "debug",
		WorkerConcurrency: 2,
		PollInterval:      100 * time.Millisecond,
	}

	mgr := worker.NewManager(cfg)
	mock := &mockTask{}
	mgr.Register(mock)

	ctx, cancel := context.WithTimeout(context.Background(), 250*time.Millisecond)
	defer cancel()

	_ = mgr.Start(ctx)

	if !mock.executed {
		t.Fatal("expected mock task to be executed")
	}
}
