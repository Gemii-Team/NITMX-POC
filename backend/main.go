package main

import (
	"fmt"
	"time"

	_ "github.com/Nxwbtk/NITMX-POC/docs"

	"github.com/Nxwbtk/NITMX-POC/internal/middlewares"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	config "github.com/Nxwbtk/NITMX-POC/config"
	auth "github.com/Nxwbtk/NITMX-POC/internal/handler/auth"
	routes "github.com/Nxwbtk/NITMX-POC/internal/routes"
)

func checkMiddleWare(c *fiber.Ctx) error {
	start := time.Now()
	fmt.Printf("URL = %s, Method = %s, Time = %s \n", c.OriginalURL(), c.Method(), start)
	return c.Next()
}

func main() {
	fmt.Println("Starting application...")

	db, err := config.SetUpDB()
	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
		return
	}
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

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("This is health check. Server is running.")
	})

	routes.SetUpRoutes(app, db)
	port := config.NewConfig().Port
	fmt.Printf("Starting server on port %s\n", port)
	if err := app.Listen(":" + port); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
