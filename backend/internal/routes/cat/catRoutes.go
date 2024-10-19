package catRoutes

import (
	catHandler "github.com/Nxwbtk/NITMX-POC/internal/handler/cat"
	"github.com/gofiber/fiber/v2"
)

func SetupCatRoutes(router fiber.Router) {
	cat := router.Group("/cat")

	cat.Get("/", catHandler.GetAllHandler)
}
