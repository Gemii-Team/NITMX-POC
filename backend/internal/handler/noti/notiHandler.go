package notiHandler

import (
	"github.com/Nxwbtk/NITMX-POC/config"
	"github.com/Nxwbtk/NITMX-POC/services"
	"github.com/gofiber/fiber/v2"
	"gopkg.in/gomail.v2"
	"gorm.io/gorm"
)

func NotiMailPost(db *gorm.DB, c *fiber.Ctx) error {
	var input struct {
		Email   string `json:"email"`
		Subject string `json:"subject"`
		Body    string `json:"body"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if input.Email == "" || input.Subject == "" || input.Body == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"StatusCode": 400,
			"Message":    "Email, Subject and Body are required",
		})
	}
	config.ConnectMail()
	m := services.Mailer{}
	message := gomail.NewMessage()
	message.SetHeader("To", input.Email)
	message.SetHeader("Subject", input.Subject)
	message.SetBody("text/html", input.Body)
	m.Send(message)
	return c.JSON(fiber.Map{
		"StatusCode": 200,
		"Message":    "Email sent successfully",
	})
}
