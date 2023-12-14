package controllers

import (
	// "fmt"	
	"html"
	"net/http"
	"regexp"
	"io/ioutil"
	"database/sql"

	"encoding/json"
	"strings"
	"realtimeforum/models"

	 "golang.org/x/crypto/bcrypt"
)

var Error string

var DB   *sql.DB	
// var user = models.User{}
type ErrorResponse struct {
    Message string `json:"message"`
    Code    int    `json:"code"`
}





func RegisterUser(w http.ResponseWriter, r *http.Request) {
	
	newUser := models.User{}
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
	}
	err = json.Unmarshal(reqBody, &newUser)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	newUser.FirstName = html.EscapeString(strings.TrimSpace(newUser.FirstName))
	newUser.LastName = html.EscapeString(strings.TrimSpace(newUser.LastName))
	newUser.Email = html.EscapeString(strings.TrimSpace(newUser.Email))
	newUser.NickName = html.EscapeString(strings.TrimSpace(newUser.NickName))
	newUser.Gender= html.EscapeString(strings.TrimSpace(newUser.Gender))

	if !verifLen(newUser.FirstName, newUser.NickName, newUser.Password) {
		Error = "Enter at least 4 input characters"
		errorResponse := ErrorResponse{
			Message: Error,
			Code:    http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	}
	if !isEmailValid(newUser.Email) {
		Error = "bad format of email"
		errorResponse := ErrorResponse{
			Message:  Error,
			Code:    http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	}
	if newUser.Password != newUser.ConfirmPassword{
		Error = "Passwords do not match"
		errorResponse := ErrorResponse{
			Message:  Error,
			Code:    http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	} else {
		haspassword, erft := bcrypt.GenerateFromPassword([]byte( newUser.Password ), 5)
		newUser.Password = string(haspassword)
		err = newUser.InsertData(DB, newUser.Age, newUser.NickName, newUser.Email, newUser.LastName, newUser.FirstName, newUser.Password,  newUser.Gender)

		if err != nil || erft != nil {
			if strings.HasPrefix(err.Error(), "UNIQUE constraint failed:") {
				Error = "Email or NickName already  exists"
				errorResponse := ErrorResponse{
					Message:  Error,
					Code:    http.StatusBadRequest,
				}
				sendReponseError(w, errorResponse, http.StatusBadRequest)
				return
			} else {
				errorResponse := ErrorResponse{
					Message:  Error,
					Code:    http.StatusInternalServerError,
				}
				sendReponseError(w, errorResponse, http.StatusInternalServerError)
				return
			}
		}
		
	}

	// if (newUser.Age==10){
	//     fmt.Println(newUser.ConfirmPassword)
		


		
		
	// }

	
	
	
}

func sendReponseError(w http.ResponseWriter, errorResponse ErrorResponse, statusCode int)  {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(errorResponse)
		
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
