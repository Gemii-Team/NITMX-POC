package models

import "gorm.io/gorm"

type Cat struct {
	gorm.Model
	Name string
	Age  int
}

type User struct {
	gorm.Model
	Username string
	Password string
	Email    string
	Tel      string
	Role     string
}
