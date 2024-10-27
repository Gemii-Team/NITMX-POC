package alertHandler

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type TransactionLog struct {
	SendingBank         int     `json:"sending_bank" gorm:"column:sending_bank;type:int4"`
	SendingAccountNum   string  `json:"sending_account_number" gorm:"column:sending_account_number;type:varchar"`
	ReceivingBank       int     `json:"receiving_bank" gorm:"column:receiving_bank;type:int4"`
	ReceivingAccountNum string  `json:"receiving_account_number" gorm:"column:receiving_account_number;type:varchar"`
	MerchantChannel     string  `json:"merchant_channel" gorm:"column:merchant_channel;type:varchar"`
	PaymentType         int     `json:"payment_type" gorm:"column:payment_type;type:int4"`
	Amount              float32 `json:"amount" gorm:"column:amount;type:float4"`
	ID                  string  `json:"id" gorm:"column:id;type:varchar"`
	Fraude              string  `json:"fraude" gorm:"column:fraude;type:varchar"`
	Acc                 float32 `json:"acc" gorm:"column:acc;type:float4"`
}

func (TransactionLog) TableName() string {
	return "stagging"
}

type TransactionFilter struct {
	SendingBank     *int     `query:"sending_bank"`
	ReceivingBank   *int     `query:"receiving_bank"`
	MerchantChannel *string  `query:"merchant_channel"`
	PaymentType     *int     `query:"payment_type"`
	FromAmount      *float32 `query:"from_amount"`
	ToAmount        *float32 `query:"to_amount"`
	Fraude          *string  `query:"fraude"`
	ID              *string  `query:"id"`
	Acc             *float32 `query:"acc"`
}

type PaginationQuery struct {
	Page     int `query:"page" default:"1"`
	PageSize int `query:"page_size" default:"50"`
}

type TransactionResponse struct {
	Data       []TransactionLog `json:"data"`
	Total      int64            `json:"total"`
	Page       int              `json:"page"`
	TotalPages int              `json:"total_pages"`
}

func GetAlert(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		pagination := new(PaginationQuery)
		if err := c.QueryParser(pagination); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error":   "Invalid pagination parameters",
				"details": err.Error(),
			})
		}

		if pagination.PageSize <= 0 {
			pagination.PageSize = 50
		}
		if pagination.Page <= 0 {
			pagination.Page = 1
		}

		filter := new(TransactionFilter)
		if err := c.QueryParser(filter); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error":   "Invalid filter parameters",
				"details": err.Error(),
			})
		}

		countQuery := db.Model(&TransactionLog{})
		dataQuery := db.Model(&TransactionLog{})

		if filter.SendingBank != nil {
			condition := "sending_bank = ?"
			countQuery = countQuery.Where(condition, *filter.SendingBank)
			dataQuery = dataQuery.Where(condition, *filter.SendingBank)
		}
		if filter.ReceivingBank != nil {
			condition := "receiving_bank = ?"
			countQuery = countQuery.Where(condition, *filter.ReceivingBank)
			dataQuery = dataQuery.Where(condition, *filter.ReceivingBank)
		}
		if filter.MerchantChannel != nil {
			condition := "merchant_channel = ?"
			countQuery = countQuery.Where(condition, *filter.MerchantChannel)
			dataQuery = dataQuery.Where(condition, *filter.MerchantChannel)
		}
		if filter.PaymentType != nil {
			condition := "payment_type = ?"
			countQuery = countQuery.Where(condition, *filter.PaymentType)
			dataQuery = dataQuery.Where(condition, *filter.PaymentType)
		}
		if filter.Fraude != nil {
			condition := "fraude = ?"
			countQuery = countQuery.Where(condition, *filter.Fraude)
			dataQuery = dataQuery.Where(condition, *filter.Fraude)
		}
		if filter.FromAmount != nil {
			condition := "amount >= ?"
			countQuery = countQuery.Where(condition, *filter.FromAmount)
			dataQuery = dataQuery.Where(condition, *filter.FromAmount)
		}
		if filter.ToAmount != nil {
			condition := "amount <= ?"
			countQuery = countQuery.Where(condition, *filter.ToAmount)
			dataQuery = dataQuery.Where(condition, *filter.ToAmount)
		}
		if filter.ID != nil {
			condition := "id = ?"
			countQuery = countQuery.Where(condition, *filter.ID)
			dataQuery = dataQuery.Where(condition, *filter.ID)
		}
		if filter.Acc != nil {
			condition := "acc = ?"
			countQuery = countQuery.Where(condition, *filter.Acc)
			dataQuery = dataQuery.Where(condition, *filter.Acc)
		}

		var total int64
		if err := countQuery.Count(&total).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error":   "Failed to count records",
				"details": err.Error(),
			})
		}

		offset := (pagination.Page - 1) * pagination.PageSize
		var transactions []TransactionLog

		if err := dataQuery.Offset(offset).Limit(pagination.PageSize).Find(&transactions).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error":   "Failed to fetch records",
				"details": err.Error(),
			})
		}

		totalPages := int(total) / pagination.PageSize
		if int(total)%pagination.PageSize != 0 {
			totalPages++
		}

		return c.JSON(TransactionResponse{
			Data:       transactions,
			Total:      total,
			Page:       pagination.Page,
			TotalPages: totalPages,
		})
	}
}
