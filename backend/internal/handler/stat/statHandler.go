package statHandler

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type PaymentTypeCount struct {
	PaymentType int `json:"payment_type"`
	Count       int `json:"count"`
}

type StatResponse struct {
	TotalTransactions int     `json:"total_transactions"`
	FraudPercentage   float64 `json:"fraud_percentage"`
	Caution           int     `json:"caution"`
}

func GetStat(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var response StatResponse

		var totalCount int64
		if err := db.Table("transactions").Count(&totalCount).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get total count: " + err.Error(),
			})
		}
		response.TotalTransactions = int(totalCount)

		var fraudCount int64
		if err := db.Table("transactions").Where("fraud = ?", 1).Count(&fraudCount).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get fraud count: " + err.Error(),
			})
		}

		if totalCount > 0 {
			response.FraudPercentage = float64(fraudCount) / float64(totalCount) * 100
		}

		var cautionCount int64
		if err := db.Table("stagging").Count(&cautionCount).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get caution count: " + err.Error(),
			})
		}
		if cautionCount >= 0 {
			response.Caution = int(cautionCount)
		}

		return c.JSON(response)
	}
}
