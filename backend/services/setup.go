package services

import (
	"fmt"
	"time"

	"github.com/Nxwbtk/NITMX-POC/config"
	"github.com/Nxwbtk/NITMX-POC/internal/handler/auth"
	"github.com/Nxwbtk/NITMX-POC/internal/middlewares"
	"github.com/Nxwbtk/NITMX-POC/internal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func checkMiddleWare(c *fiber.Ctx) error {
	start := time.Now()
	fmt.Printf("URL = %s, Method = %s, Time = %s \n", c.OriginalURL(), c.Method(), start)
	return c.Next()
}

func SetUpFiber(db *gorm.DB) *fiber.App {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	authHandler := auth.NewSignInHandler(db)

	app.Post("/signIn", authHandler.SignIn)
	app.Post("/signUp", authHandler.SignUp)

	app.Use(checkMiddleWare)
	app.Use(middlewares.NewAuthMiddleware(config.NewConfig().Secret))
	return app
}

func SetUpDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		config.NewConfig().DB_HOST,
		config.NewConfig().DB_USER,
		config.NewConfig().DB_PASS,
		config.NewConfig().DB_NAME,
		config.NewConfig().DB_PORT)

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
