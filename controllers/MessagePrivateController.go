package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"realtimeforum/models"
)

type MessageJson struct {
	FromUser       string `json:"FromUser"`
	ContentMessage string `json:"Message"`
	ToUser         string `json:"ToUser"`
}

func CreateMessage(w http.ResponseWriter, r *http.Request) {

	messengers := MessageJson{}

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
	}
	err = json.Unmarshal(reqBody, &messengers)

	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)

	}

	if len(messengers.ContentMessage) == 0 {
		Error = "content is empty"
		errorResponse := ErrorResponse{
			Message:    Error,
			ErrorClass: "emptycomment",
			Code:       http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	}

	fmt.Println("mess", messengers)
	com := models.MessagePrivate{}
	errinsert := com.InsertMessage(DB, messengers.FromUser, messengers.ToUser, messengers.ContentMessage)

	if errinsert != nil {
		fmt.Println(errinsert)
		// helper.ErrorPage(w, 500)
		return
	}

}
