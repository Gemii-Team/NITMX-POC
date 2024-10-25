package statRoutes

import (
	statHandler "github.com/Nxwbtk/NITMX-POC/internal/handler/stat"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupStatRoutes(router fiber.Router, db *gorm.DB) {
	stat := router.Group("/stat")

	stat.Get("/list", statHandler.GetStat(db))
	stat.Get("/merchant", statHandler.GetMerchantChannelStats(db))
}
