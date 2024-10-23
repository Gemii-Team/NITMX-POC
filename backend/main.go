package main

import (
	"fmt"

	_ "github.com/Nxwbtk/NITMX-POC/docs"
	"github.com/Nxwbtk/NITMX-POC/services"

	config "github.com/Nxwbtk/NITMX-POC/config"
	routes "github.com/Nxwbtk/NITMX-POC/internal/routes"
)

func main() {
	fmt.Println("Starting application...")

	db, err := config.SetUpDB()
	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
		return
	}

	app := services.SetUpFiber(db)
	routes.SetUpRoutes(app, db)

	port := config.NewConfig().Port
	fmt.Printf("Starting server on port %s\n", port)
	if err := app.Listen(":" + port); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
