package auth

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"

	config "github.com/Nxwbtk/NITMX-POC/config"
)

type Users struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

var user = Users{
	Email:    "a@a.com",
	Password: "123",
}

func SignIn(c *fiber.Ctx) error {
	usr := new(Users)
	err := c.BodyParser(usr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Body incorrect")
	}
	if user.Email != usr.Email || user.Password != usr.Password {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = usr.Email
	claims["role"] = "admin"
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	t, err := token.SignedString([]byte(config.NewConfig().Secret))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.JSON(fiber.Map{
		"accessToken": t,
	})
}
