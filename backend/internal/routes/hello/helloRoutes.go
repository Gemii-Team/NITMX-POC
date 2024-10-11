package helloRoutes

import (
	helloHandler "github.com/Nxwbtk/NITMX-POC/internal/handler/hello"
	"github.com/gofiber/fiber/v2"
)

func SetupHelloRoutes(router fiber.Router) {
	hello := router.Group("/hello")

	hello.Get("/", helloHandler.HelloHandler)

	hello.Get("/:name", helloHandler.HelloNameHandler)

}
