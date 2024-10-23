package notiRoutes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	notiHandler "github.com/Nxwbtk/NITMX-POC/internal/handler/noti"
)

func NotiRoutes(router fiber.Router, db *gorm.DB) {
	routes := router.Group("/noti")

	routes.Post("/mail", func(c *fiber.Ctx) error {
		return notiHandler.NotiMailPost(db, c)
	})
}
