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

type Staging struct {
	gorm.Model
	SendingBank         int     `json:"sending_bank" gorm:"type:int4;column:sending_bank"`
	SendingAccountNum   string  `json:"sending_account_number" gorm:"type:varchar(255);column:sending_account_number"`
	ReceivingBank       int     `json:"receiving_bank" gorm:"type:int4;column:receiving_bank"`
	ReceivingAccountNum string  `json:"receiving_account_number" gorm:"type:varchar(255);column:receiving_account_number"`
	MerchantChannel     string  `json:"merchant_channel" gorm:"type:varchar(50);column:merchant_channel"`
	PaymentType         int     `json:"payment_type" gorm:"type:int4;column:payment_type"`
	Amount              float32 `json:"amount" gorm:"type:float4;column:amount"`
	ID                  string  `json:"id" gorm:"type:varchar(50);column:id"`
	Fraude              int     `json:"fraude" gorm:"type:int4;column:fraude"`
	Acc                 float32 `json:"acc" gorm:"type:float4;column:acc"`
}
