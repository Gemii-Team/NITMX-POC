package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config struct
type Config struct {
	Port    string
	Secret  string
	DB_HOST string
	DB_USER string
	DB_PASS string
	DB_NAME string
	DB_PORT string
}

func NewConfig() *Config {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: .env file not found or error loading. Using system environment variables.")
	}

	return &Config{
		Port:    getEnvOrDefault("PORT", "9999"),
		Secret:  getEnvOrThrow("SECRET"),
		DB_HOST: getEnvOrThrow("DB_HOST"),
		DB_USER: getEnvOrThrow("DB_USER"),
		DB_PASS: getEnvOrThrow("DB_PASS"),
		DB_NAME: getEnvOrThrow("DB_NAME"),
		DB_PORT: getEnvOrDefault("DB_PORT", "5432"),
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
