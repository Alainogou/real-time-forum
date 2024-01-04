package controllers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"realtimeforum/helper"
	"realtimeforum/models"
	"strconv"
	"strings"
	"time"
)

var Datas = models.UserData{}

func Posts(w http.ResponseWriter, r *http.Request) {

}


func CreatePost(w http.ResponseWriter, r *http.Request) {
	Datas.ErrorLog = ""
	ok, _ := helper.CheckRequest(r, "/post", "post")
	if !ok {
		// helper.ErrorPage(w, ErrorPage)
		return
	}
	errf := r.ParseMultipartForm(1024 * 1024 * 23)
	if errf != nil {
		fmt.Println(errf)
		// helper.ErrorPage(w, 500)
		return
	}
	PostTitle := r.PostFormValue("title")
	cat := r.PostForm["cat"]
	content := r.PostFormValue("content")
	post := models.Post{}
	catids, errrr := helper.ParseCatId(cat)

	file, header, errfile := r.FormFile("postimage")
	user_id, errtu := strconv.Atoi(r.FormValue("user_id"))

	var imagename string
	if errfile == nil {
		buffer := make([]byte, 512)
		_, er := file.Read(buffer)
		if er != nil {
			// helper.ErrorPage(w, 500)
			return
		}
		file.Seek(0, 0)

		contentType := http.DetectContentType(buffer)
		ImgExt := strings.Split(header.Filename, ".")
		VAlinotdImg := len(ImgExt) <= 1 || !CheckExtension(ImgExt[len(ImgExt)-1]) || len(strings.Split(contentType, "/")[0]) <= 0 || strings.Split(contentType, "/")[0] != "image"

		if VAlinotdImg {
			// helper.ErrorPage(w, http.StatusBadRequest)
			return
		}
		if float64(header.Size/1000000) >= 20.00 {
			Datas.ErrorLog = "revoire taille du fichier"
			return
		}

		errforc := os.MkdirAll("./static/img/posts", os.ModePerm)
		imagename = fmt.Sprintf("%d-%s", time.Now().UnixNano(), header.Filename)
		dst, errcre := os.Create(fmt.Sprintf("./static/img/posts/%s", imagename))
		if errforc != nil || errcre != nil {
			// helper.ErrorPage(w, 500)
			return
		}
		_, errcopy := io.Copy(dst, file)
		if errcopy != nil {
			// helper.ErrorPage(w, 500)
			return
		}
	}
	if errtu != nil {
		fmt.Println(errfile)
		fmt.Println(errtu)
		// helper.ErrorPage(w, http.StatusBadRequest)
		return
	}

	var erri error
	if len(PostTitle) > 0 && len(cat) > 0 && len(content) > 0 {
		if errrr == nil && errtu == nil {
			erri = post.InsertPost(DB, PostTitle, content, imagename, user_id, catids)
		}
		if erri != nil || errrr != nil || errtu != nil {
			fmt.Println(erri)
			fmt.Println(errrr)
			fmt.Println(errtu)
			// helper.ErrorPage(w, 404)
			return
		}
	} else {
		Datas.ErrorLog = "veiller remplir tous les champs"
	}
	http.Redirect(w, r, "/", 302)

}

func CheckExtension(ext string) bool {
	extention := []string{"jpeg", "png", "gif"}
	for _, v := range extention {

		if v == ext {
			return true
		}
	}
	return false
}
