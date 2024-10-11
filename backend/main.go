package main

import (
	"fmt"
	"time"

	"github.com/Nxwbtk/NITMX-POC/internal/middlewares"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	config "github.com/Nxwbtk/NITMX-POC/config"
	auth "github.com/Nxwbtk/NITMX-POC/internal/handler/auth"
	helloRoutes "github.com/Nxwbtk/NITMX-POC/internal/routes/hello"
)

func checkMiddleWare(c *fiber.Ctx) error {
	start := time.Now()

	fmt.Printf("URL = %s, Method = %s, Time = %s \n", c.OriginalURL(), c.Method(), start)
	return c.Next()
}

func main() {
	// fiber instance

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Adjust this to be more restrictive if needed
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// setup auth routes
	app.Post("/signIn", auth.SignIn)

	app.Use(checkMiddleWare)

	app.Use(middlewares.NewAuthMiddleware(config.NewConfig().Secret))

	// routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello world 🌈")
	})

	// setup routes
	helloRoutes.SetupHelloRoutes(app)

	// app listening at PORT: 3000
	app.Listen(`:` + config.NewConfig().Port)
}
