package config

import (
	"log/slog"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the worker service.
type Config struct {
	AppEnv            string
	AppName           string
	LogLevel          string
	WorkerConcurrency int
	PollInterval      time.Duration
}

// Load loads configuration from .env and environment variables.
func Load() (*Config, error) {
	// Attempt to load .env, ignore error if file not found
	if err := godotenv.Load(); err != nil {
		slog.Debug("No .env file found or error reading .env, relying on system env")
	}

	cfg := &Config{
		AppEnv:            getEnv("APP_ENV", "development"),
		AppName:           getEnv("APP_NAME", "clickfor-worker"),
		LogLevel:          getEnv("LOG_LEVEL", "info"),
		WorkerConcurrency: getEnvAsInt("WORKER_CONCURRENCY", 5),
		PollInterval:      getEnvAsDuration("WORKER_POLL_INTERVAL", 5*time.Second),
	}

	return cfg, nil
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(valStr)
	if err != nil {
		return defaultVal
	}
	return val
}

func getEnvAsDuration(key string, defaultVal time.Duration) time.Duration {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	d, err := time.ParseDuration(valStr)
	if err != nil {
		return defaultVal
	}
	return d
}
