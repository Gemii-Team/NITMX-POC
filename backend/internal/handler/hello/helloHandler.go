package helloHandler

import "github.com/gofiber/fiber/v2"

func HelloHandler(c *fiber.Ctx) error {
	return c.SendString("hello world 🌈")
}

func HelloNameHandler(c *fiber.Ctx) error {
	name := c.Params("name")
	return c.SendString("hello " + name)
}
