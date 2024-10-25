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

type Code struct {
	gorm.Model
	CodeId string
}

type TransactionLog struct {
	gorm.Model
	TranDateTime        string  `json:"tran_date_time" db:"tran_date_time"`
	SendingBank         int     `json:"sending_bank" db:"sending_bank"`
	SendingAccountNum   string  `json:"sending_account_number" db:"sending_account_number"`
	ReceivingBank       int     `json:"receiving_bank" db:"receiving_bank"`
	ReceivingAccountNum string  `json:"receiving_account_number" db:"receiving_account_number"`
	MerchantChannel     string  `json:"merchant_channel" db:"merchant_channel"`
	PaymentType         int     `json:"payment_type" db:"payment_type"`
	Amount              float32 `json:"amount" db:"amount"`
	Fraud               int     `json:"fraud" db:"fraud"`
}
