package controllers

import (
	"fmt"
	"realtimeforum/models"

	"net/http"
	"strconv"
	"strings"
)

func CommentPost(w http.ResponseWriter, r *http.Request) {
	_, email := Auth(DB,w, r)
	user := models.User{}
	erru := user.GetOneUser(DB, email)
	errf := r.ParseForm()
	if errf != nil || erru != nil {
		// helper.ErrorPage(w, 500)
		return
	}

	comment := strings.TrimSpace((r.FormValue("comment")))
	post_id, errconv := strconv.Atoi(r.FormValue("post_id"))

	if errconv != nil {
		fmt.Println(errconv)
		// helper.ErrorPage(w, 404)
		return
	}
	if len(comment) > 0 {
		com := models.Comment{}
		errinsert := com.InsertComments(DB, post_id, user.Id, comment)

		if errinsert != nil {
			fmt.Println(errinsert)
			// helper.ErrorPage(w, 500)
			return
		}
	}
	// http.Redirect(w, r, "post/"+strconv.Itoa(post_id), 302)
}
