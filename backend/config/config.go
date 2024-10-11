package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config struct
type Config struct {
	Port   string
	Secret string
}

func NewConfig() *Config {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: .env file not found or error loading. Using system environment variables.")
	}

	return &Config{
		Port:   getEnvOrDefault("PORT", "9999"),
		Secret: getEnvOrThrow("SECRET"),
	}
}

// getEnvOrDefault retrieves an environment variable or returns a default value
func getEnvOrDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvOrThrow(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Environment variable %s is not set", key)
	}
	return value
}
