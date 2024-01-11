package controllers

import (
	"encoding/json"
	"net/http"
	"realtimeforum/models"
	"fmt"
	"strconv"
	"strings"
)




func GetComments(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path
	splitPath := strings.Split(urlPath, "/")
	id := splitPath[len(splitPath)-1]
	num, err:=strconv.Atoi(id)
	fmt.Println()
	if err!=nil{
		fmt.Println("yes il y a get comments")
	}

	com:=models.Comment{}
	comment, err:=com.GetComments(DB, num)
	fmt.Println(comment, err)
	

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(comment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
}