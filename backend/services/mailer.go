package services

import (
	"log"

	"github.com/Nxwbtk/NITMX-POC/config"
	"gopkg.in/gomail.v2"
)

type Mailer struct{}

func (m *Mailer) Send(message *gomail.Message) {
	message.SetHeader("From", "buntakan0703@gmail.com")

	if err := config.Mailer.DialAndSend(message); err != nil {
		log.Panicln("[Mailer] ", err)
	}
}
