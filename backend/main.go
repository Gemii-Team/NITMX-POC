package main

import (
	"fmt"
	"time"

	_ "github.com/Nxwbtk/NITMX-POC/docs"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/Nxwbtk/NITMX-POC/internal/middlewares"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"

	config "github.com/Nxwbtk/NITMX-POC/config"
	auth "github.com/Nxwbtk/NITMX-POC/internal/handler/auth"
	catRoutes "github.com/Nxwbtk/NITMX-POC/internal/routes/cat"
	helloRoutes "github.com/Nxwbtk/NITMX-POC/internal/routes/hello"
	transactionLogRoutes "github.com/Nxwbtk/NITMX-POC/internal/routes/transactionLog"

	models "github.com/Nxwbtk/NITMX-POC/internal/models"
)

func checkMiddleWare(c *fiber.Ctx) error {
	start := time.Now()
	fmt.Printf("URL = %s, Method = %s, Time = %s \n", c.OriginalURL(), c.Method(), start)
	return c.Next()
}

func main() {
	fmt.Println("Starting application...")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		config.NewConfig().DB_HOST,
		config.NewConfig().DB_USER,
		config.NewConfig().DB_PASS,
		config.NewConfig().DB_NAME,
		config.NewConfig().DB_PORT)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
		return
	}

	if err := db.AutoMigrate(&models.User{}, &models.Cat{}); err != nil {
		fmt.Printf("Failed to auto-migrate: %v\n", err)
		return
	}

	app := fiber.New()

	app.Get("/api/v1/docs/*", swagger.HandlerDefault)

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	authHandler := auth.NewSignInHandler(db)
	app.Post("/signIn", authHandler.SignIn)
	app.Post("/signUp", authHandler.SignUp)

	app.Use(checkMiddleWare)
	app.Use(middlewares.NewAuthMiddleware(config.NewConfig().Secret))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello world 🌈")
	})

	helloRoutes.SetupHelloRoutes(app)
	catRoutes.SetupCatRoutes(app)
	transactionLogRoutes.Transaction(app, db)

	port := config.NewConfig().Port
	fmt.Printf("Starting server on port %s\n", port)
	if err := app.Listen(":" + port); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
