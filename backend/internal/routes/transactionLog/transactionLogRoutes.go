package transactionLogRoutes

import (
	transactionLog "github.com/Nxwbtk/NITMX-POC/internal/handler/transactionLog"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Transaction(router fiber.Router, db *gorm.DB) {
	hello := router.Group("/transaction")

	hello.Get("/list", transactionLog.GetTransactions(db))

	hello.Get("/graph", func(c *fiber.Ctx) error {
		data, err := transactionLog.GetTransactionGraph(db, c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.JSON(data)
	})
}
