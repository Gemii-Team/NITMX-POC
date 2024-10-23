package services

import (
	"fmt"
	"time"

	"github.com/Nxwbtk/NITMX-POC/config"
	"github.com/Nxwbtk/NITMX-POC/internal/handler/auth"
	"github.com/Nxwbtk/NITMX-POC/internal/middlewares"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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
