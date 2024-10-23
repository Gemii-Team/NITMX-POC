package routes

import (
	catRoutes "github.com/Nxwbtk/NITMX-POC/internal/routes/cat"
	helloRoutes "github.com/Nxwbtk/NITMX-POC/internal/routes/hello"
	noti "github.com/Nxwbtk/NITMX-POC/internal/routes/noti"
	transactionLogRoutes "github.com/Nxwbtk/NITMX-POC/internal/routes/transactionLog"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetUpRoutes(app *fiber.App, db *gorm.DB) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("This is health check. Server is running.")
	})
	helloRoutes.SetupHelloRoutes(app)
	catRoutes.SetupCatRoutes(app)
	transactionLogRoutes.Transaction(app, db)
	noti.NotiRoutes(app, db)
}
