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
	Warning           int     `json:"warning"`
}

func GetStat(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var response StatResponse
		var totalCount int64
		if err := db.Table("transaction_log").Count(&totalCount).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get total count: " + err.Error(),
			})
		}
		response.TotalTransactions = int(totalCount)
		var fraudCount int64
		if err := db.Table("transaction_log").Where("fraud = ?", 1).Count(&fraudCount).Error; err != nil {
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
		var bankCount int64
		if err := db.Table("stagging").Where("fraude = ?", "0").Count(&bankCount).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get fraud count: " + err.Error(),
			})
		}
		response.Warning = int(bankCount)

		return c.JSON(response)
	}
}

type MerchantChannelCount struct {
	MerchantChannel string `json:"merchant_channel"`
	Count           int64  `json:"count"`
}

func GetMerchantChannelStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var results []MerchantChannelCount

		err := db.Table("transaction_log").
			Select("merchant_channel, COUNT(*) as count").
			Group("merchant_channel").
			Order("count DESC").
			Find(&results).Error

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get merchant channel statistics: " + err.Error(),
			})
		}

		response := fiber.Map{
			"data":             results,
			"total_categories": len(results),
		}

		return c.JSON(response)
	}
}

func GetMerchantChannelStatsWithFilters(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		fromDate := c.Query("from_date")
		toDate := c.Query("to_date")
		fraudFilter := c.Query("fraud")

		var results []MerchantChannelCount

		query := db.Table("transaction_log").
			Select("merchant_channel, COUNT(*) as count")

		if fromDate != "" {
			query = query.Where("tran_date_time >= ?", fromDate)
		}
		if toDate != "" {
			query = query.Where("tran_date_time <= ?", toDate)
		}
		if fraudFilter != "" {
			query = query.Where("fraud = ?", fraudFilter)
		}

		err := query.Group("merchant_channel").
			Order("count DESC").
			Find(&results).Error

		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get merchant channel statistics: " + err.Error(),
			})
		}

		response := fiber.Map{
			"data":             results,
			"total_categories": len(results),
			"filters_applied": fiber.Map{
				"from_date": fromDate,
				"to_date":   toDate,
				"fraud":     fraudFilter,
			},
		}
		return c.JSON(response)
	}
}
