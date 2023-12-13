package controllers

import (
	// "fmt"	
	// "html"
	"net/http"
	"regexp"
	// "strings"

	// "golang.org/x/crypto/bcrypt"
)

var Error string

// var user = models.User{}

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	
}

func isEmailValid(e string) bool {
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return emailRegex.MatchString(e)
}

func verifLen(data ...string) bool {
	for _, v := range data {
		if len(v) < 4 {
			return false
		}
	}
	return true
}
