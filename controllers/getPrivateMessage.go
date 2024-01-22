package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"realtimeforum/models"
	"strings"
)

func GetPrivateMessage(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path
	splitPath := strings.Split(urlPath, "/")
	res := splitPath[len(splitPath)-1]

	cm := strings.Split(res, "+")
	fmt.Println(cm, res)
	message := models.MessageSender{}
	user_forum, err := models.GetMessage(DB, cm[0], cm[1])
	user_receiver, err1 := models.GetMessage(DB, cm[1], cm[0])

	if err != nil || err1 != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	message.UserForum = user_forum
	message.UserReceiver = user_receiver
	err = json.NewEncoder(w).Encode(message)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}
