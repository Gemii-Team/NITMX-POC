package catHandler

import (
	"fmt"
	"log"

	"github.com/Nxwbtk/NITMX-POC/config"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Cat struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func GetAllHandler(c *fiber.Ctx) error {
	cfg := config.NewConfig()
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", cfg.DB_HOST, cfg.DB_USER, cfg.DB_PASS, cfg.DB_NAME, cfg.DB_PORT)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("failed to connect to database: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to connect to database"})
	}

	var cats []Cat
	if err := db.Find(&cats).Error; err != nil {
		log.Printf("failed to retrieve cats: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to retrieve cats"})
	}

	return c.JSON(cats)
}
