package config

import (
	"crypto/tls"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/Nxwbtk/NITMX-POC/internal/models"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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

func SetUpDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		NewConfig().DB_HOST,
		NewConfig().DB_USER,
		NewConfig().DB_PASS,
		NewConfig().DB_NAME,
		NewConfig().DB_PORT)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
		return nil, err
	}

	if err := db.AutoMigrate(&models.User{}, &models.Cat{}); err != nil {
		fmt.Printf("Failed to auto-migrate: %v\n", err)
		return nil, err
	}
	return db, nil
}
