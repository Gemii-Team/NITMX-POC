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
)

func checkMiddleWare(c *fiber.Ctx) error {
	start := time.Now()

	fmt.Printf("URL = %s, Method = %s, Time = %s \n", c.OriginalURL(), c.Method(), start)
	return c.Next()
}

type Cat struct {
	gorm.Model
	Name string
	Age  int
}

func main() {
	// fiber instance

	// dsn := "host=" + config.NewConfig().DB_HOST + "user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", config.NewConfig().DB_HOST, config.NewConfig().DB_USER, config.NewConfig().DB_PASS, config.NewConfig().DB_NAME, config.NewConfig().DB_PORT)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Print(err)
		return
	}
	db.AutoMigrate(&Cat{})

	app := fiber.New()

	app.Get("/api/v1/docs/*", swagger.HandlerDefault)

	// routes

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Adjust this to be more restrictive if needed
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// setup auth routes
	app.Post("/signIn", auth.SignIn)

	app.Use(checkMiddleWare)

	app.Use(middlewares.NewAuthMiddleware(config.NewConfig().Secret))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello world 🌈")
	})

	// setup routes
	helloRoutes.SetupHelloRoutes(app)
	catRoutes.SetupCatRoutes(app)

	// app listening at PORT: 3000
	app.Listen(`:` + config.NewConfig().Port)
}
