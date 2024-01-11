package controllers

import (
	"encoding/json"
	"net/http"
	"realtimeforum/models"
)

func GetPosts(w http.ResponseWriter, r *http.Request) {
	
	post := models.Post{}

	allpost, err := post.GetAllPosts(DB)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(allpost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

