package helloHandler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type TransactionLog struct {
	TranDateTime        string  `json:"tran_date_time" gorm:"column:tran_date_time;type:varchar(50)"`
	SendingBank         int     `json:"sending_bank" gorm:"column:sending_bank;type:int4"`
	SendingAccountNum   string  `json:"sending_account_number" gorm:"column:sending_account_number;type:varchar(255)"`
	ReceivingBank       int     `json:"receiving_bank" gorm:"column:receiving_bank;type:int4"`
	ReceivingAccountNum string  `json:"receiving_account_number" gorm:"column:receiving_account_number;type:varchar(255)"`
	MerchantChannel     string  `json:"merchant_channel" gorm:"column:merchant_channel;type:varchar(30)"`
	PaymentType         int     `json:"payment_type" gorm:"column:payment_type;type:int4"`
	Amount              float32 `json:"amount" gorm:"column:amount;type:float4"`
	Fraud               int     `json:"fraud" gorm:"column:fraud;type:int4"`
}

func (TransactionLog) TableName() string {
	return "transaction_log"
}

type TransactionFilter struct {
	SendingBank     *int     `query:"sending_bank"`
	ReceivingBank   *int     `query:"receiving_bank"`
	MerchantChannel *string  `query:"merchant_channel"`
	PaymentType     *int     `query:"payment_type"`
	FromAmount      *float32 `query:"from_amount"`
	ToAmount        *float32 `query:"to_amount"`
	FromDate        *string  `query:"from_date"`
	ToDate          *string  `query:"to_date"`
	Fraud           *int     `query:"fraud"`
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

type GraphNode struct {
	ID    string `json:"id"`
	Label string `json:"label"`
}

type GraphEdge struct {
	ID     string  `json:"id"`
	From   string  `json:"from"`
	To     string  `json:"to"`
	Amount float32 `json:"amount"`
	Title  string  `json:"title"`
}

type GraphData struct {
	Nodes []GraphNode `json:"nodes"`
	Edges []GraphEdge `json:"edges"`
}

func GetTransactions(db *gorm.DB) fiber.Handler {
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
		if filter.Fraud != nil {
			condition := "fraud = ?"
			countQuery = countQuery.Where(condition, *filter.Fraud)
			dataQuery = dataQuery.Where(condition, *filter.Fraud)
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
		if filter.FromDate != nil {
			condition := "tran_date_time >= ?"
			countQuery = countQuery.Where(condition, *filter.FromDate)
			dataQuery = dataQuery.Where(condition, *filter.FromDate)
		}
		if filter.ToDate != nil {
			condition := "tran_date_time <= ?"
			countQuery = countQuery.Where(condition, *filter.ToDate)
			dataQuery = dataQuery.Where(condition, *filter.ToDate)
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

type GraphRequestParams struct {
	AccountNumber string `query:"accountNumber" validate:"required"`
	Depth         int    `query:"depth" validate:"required,min=1,max=5"`
}

func GetTransactionGraph(db *gorm.DB, c *fiber.Ctx) (*GraphData, error) {
	params := new(GraphRequestParams)
	if err := c.QueryParser(params); err != nil {
		return nil, c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid query parameters",
			"details": err.Error(),
		})
	}

	graph := &GraphData{
		Nodes: make([]GraphNode, 0),
		Edges: make([]GraphEdge, 0),
	}

	processedNodes := make(map[string]bool)

	err := buildGraphRecursive(db, params.AccountNumber, params.Depth, graph, processedNodes)
	if err != nil {
		return nil, err
	}

	return graph, nil
}

func buildGraphRecursive(db *gorm.DB, accountNum string, depth int, graph *GraphData, processedNodes map[string]bool) error {
	if depth <= 0 {
		return nil
	}

	if !processedNodes[accountNum] {
		graph.Nodes = append(graph.Nodes, GraphNode{
			ID:    accountNum,
			Label: accountNum,
		})
		processedNodes[accountNum] = true
	}

	var transactions []TransactionLog
	err := db.Where("sending_account_number = ? OR receiving_account_number = ?",
		accountNum, accountNum).Find(&transactions).Error
	if err != nil {
		return err
	}

	for i, trans := range transactions {
		edgeID := fmt.Sprintf("edge_%d", i)

		if trans.SendingAccountNum == accountNum {
			if !processedNodes[trans.ReceivingAccountNum] {
				graph.Nodes = append(graph.Nodes, GraphNode{
					ID:    trans.ReceivingAccountNum,
					Label: trans.ReceivingAccountNum,
				})
				processedNodes[trans.ReceivingAccountNum] = true
			}

			graph.Edges = append(graph.Edges, GraphEdge{
				ID:     edgeID,
				From:   trans.SendingAccountNum,
				To:     trans.ReceivingAccountNum,
				Amount: trans.Amount,
				Title:  fmt.Sprintf("Amount: %.2f", trans.Amount),
			})

			err = buildGraphRecursive(db, trans.ReceivingAccountNum, depth-1, graph, processedNodes)
			if err != nil {
				return err
			}
		}

		if trans.ReceivingAccountNum == accountNum {
			if !processedNodes[trans.SendingAccountNum] {
				graph.Nodes = append(graph.Nodes, GraphNode{
					ID:    trans.SendingAccountNum,
					Label: trans.SendingAccountNum,
				})
				processedNodes[trans.SendingAccountNum] = true
			}

			graph.Edges = append(graph.Edges, GraphEdge{
				ID:     edgeID,
				From:   trans.SendingAccountNum,
				To:     trans.ReceivingAccountNum,
				Amount: trans.Amount,
				Title:  fmt.Sprintf("Amount: %.2f", trans.Amount),
			})

			err = buildGraphRecursive(db, trans.SendingAccountNum, depth-1, graph, processedNodes)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
