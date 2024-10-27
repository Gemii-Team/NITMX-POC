package main

import (
	"fmt"

	_ "github.com/Nxwbtk/NITMX-POC/docs"
	routes "github.com/Nxwbtk/NITMX-POC/internal/routes"
	"github.com/Nxwbtk/NITMX-POC/services"
)

func main() {
	fmt.Println("Starting application...")

	db, err := services.SetUpDB()
	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
		return
	}

	app := services.SetUpFiber(db)
	routes.SetUpRoutes(app, db)
	services.SetUpServer(app)
}
