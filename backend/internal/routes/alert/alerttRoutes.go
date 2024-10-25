package alerttRoutes

import (
	alertHandler "github.com/Nxwbtk/NITMX-POC/internal/handler/alert"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Alert(router fiber.Router, db *gorm.DB) {
	hello := router.Group("/alert")

	hello.Get("/list", alertHandler.GetAlert(db))
}
