package main

import (
	"fmt"

	_ "github.com/Nxwbtk/NITMX-POC/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
)

func main() {
	fmt.Println("hello world")

	// fiber instance
	app := fiber.New()

	app.Get("/swagger/*", swagger.HandlerDefault)

	// routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello world 🌈")
	})

	// app listening at PORT: 3000
	app.Listen(":9999")
}
