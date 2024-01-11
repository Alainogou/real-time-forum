package controllers

import (
	"fmt"
	// "realtimeforum/models"
	"encoding/json"

	"io/ioutil"
	"net/http"
	
)

type CommentJson struct {
	User_id int `json:"User_id"`
	Post_id		int  `json:"Post_id"`
	Content       string `json:"Content"`
	
}

func CreateComment(w http.ResponseWriter, r *http.Request) {

	comments := CommentJson{}

	
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
	}
	err = json.Unmarshal(reqBody, &comments)
	fmt.Println(comments)

	// _, email := Auth(DB,w, r)
	// user := models.User{}
	// erru := user.GetOneUser(DB, email)
	// errf := r.ParseForm()
	// if errf != nil || erru != nil {
	// 	// helper.ErrorPage(w, 500)
	// 	return
	// }

	// comment := strings.TrimSpace((r.FormValue("comment")))
	// post_id, errconv := strconv.Atoi(r.FormValue("post_id"))

	// if errconv != nil {
	// 	fmt.Println(errconv)
	// 	// helper.ErrorPage(w, 404)
	// 	return
	// }
	// if len(comment) > 0 {
	// 	com := models.Comment{}
	// 	errinsert := com.InsertComments(DB, post_id, user.Id, comment)

	// 	if errinsert != nil {
	// 		fmt.Println(errinsert)
	// 		// helper.ErrorPage(w, 500)
	// 		return
	// 	}
	// }
	// http.Redirect(w, r, "post/"+strconv.Itoa(post_id), 302)
}
