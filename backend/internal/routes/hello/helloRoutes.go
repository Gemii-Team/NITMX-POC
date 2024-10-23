package helloRoutes

import (
	helloHandler "github.com/Nxwbtk/NITMX-POC/internal/handler/hello"
	"github.com/gofiber/fiber/v2"
)

func SetupHelloRoutes(router fiber.Router) {
	hello := router.Group("/hello")

	// @Summary Hello World
	// @Description Returns a hello world message
	// @Tags hello
	// @Success 200 {string} string "hello world 🌈"
	// @Router /hello [get]
	hello.Get("/", helloHandler.HelloHandler)

	// @Summary Hello Name
	// @Description Returns a hello message with the provided name
	// @Tags hello
	// @Param name path string true "Name"
	// @Success 200 {string} string "hello {name} 🌈"
	// @Router /hello/{name} [get]
	hello.Get("/:name", helloHandler.HelloNameHandler)
}
