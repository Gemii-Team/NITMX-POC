package config

import (
	"crypto/tls"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

// Config struct
type Config struct {
	Port      string
	Secret    string
	DB_HOST   string
	DB_USER   string
	DB_PASS   string
	DB_NAME   string
	DB_PORT   string
	SMTP_HOST string
	SMTP_PORT string
	SMTP_USER string
	SMTP_PASS string
}

func NewConfig() *Config {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: .env file not found or error loading. Using system environment variables.")
	}

	return &Config{
		Port:      getEnvOrDefault("PORT", "9999"),
		Secret:    getEnvOrThrow("SECRET"),
		DB_HOST:   getEnvOrThrow("DB_HOST"),
		DB_USER:   getEnvOrThrow("DB_USER"),
		DB_PASS:   getEnvOrThrow("DB_PASS"),
		DB_NAME:   getEnvOrThrow("DB_NAME"),
		DB_PORT:   getEnvOrDefault("DB_PORT", "5432"),
		SMTP_HOST: getEnvOrThrow("SMTP_HOST"),
		SMTP_PORT: getEnvOrThrow("SMTP_PORT"),
		SMTP_USER: getEnvOrThrow("SMTP_USERNAME"),
		SMTP_PASS: getEnvOrThrow("SMTP_PASS"),
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

var Mailer *gomail.Dialer

func getEnvOrThrow(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Environment variable %s is not set", key)
	}
	return value
}

func ConnectMail() {
	mailer := gomail.NewDialer(
		NewConfig().SMTP_HOST,
		func() int {
			port, err := strconv.Atoi(NewConfig().SMTP_PORT)
			if err != nil {
				// handle the error appropriately, for now, we will just return a default port
				return 587
			}
			return port
		}(),
		NewConfig().SMTP_USER,
		NewConfig().SMTP_PASS,
	)
	mailer.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	Mailer = mailer
}
