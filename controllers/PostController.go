package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"realtimeforum/models"
	"strings"
)

var Datas = models.UserData{}

func Posts(w http.ResponseWriter, r *http.Request) {

}

type PostContent struct {
	ID          int    `json:"ID"`
	User_id     string `json:"User_id"`
	Category_id int    `json:"Category_id"`
	Title       string `json:"Title"`
	Content     string `json:"Content"`
	Cat         []int  `json:"Cat"`
	ImageName   string `json:"ImageName"`
	ImageType   string `json:"ImageType"`
	ImageSize   int    `json:"ImageSize"`
}

func CreatePost(w http.ResponseWriter, r *http.Request) {

	var newPost PostContent
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
	}
	err = json.Unmarshal(reqBody, &newPost)

	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	fmt.Println("new post", newPost)
	if newPost.Title == "" {
		Error = " Please Enter a title"
		errorResponse := ErrorResponse{
			Message:    Error,
			ErrorClass: "titleNoFound",
			Code:       http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	}

	if len(newPost.Cat) == 0 {
		Error = " Please choose a category"
		errorResponse := ErrorResponse{
			Message:    Error,
			ErrorClass: "categoryNofound",
			Code:       http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	}
	if newPost.Content == "" {
		Error = " Please Enter your message"
		errorResponse := ErrorResponse{
			Message:    Error,
			ErrorClass: "contentNofound",
			Code:       http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	}
	contentType := newPost.ImageType
	imgExt := strings.Split(newPost.ImageName, ".")
	isInvalidImage := len(imgExt) <= 1 || !CheckExtension(strings.ToLower(imgExt[len(imgExt)-1])) || !strings.HasPrefix(contentType, "image/")
	fmt.Println("Invalid image:", isInvalidImage)
	if isInvalidImage {
		Error = "Image format is incorrect"
		errorResponse := ErrorResponse{
			Message:    Error,
			ErrorClass: "InvalidImageFormat",
			Code:       http.StatusBadRequest,
		}
		sendReponseError(w, errorResponse, http.StatusBadRequest)
		return
	}

	if newPost.ImageName == "" {
		fmt.Println("yes")

	}
	// Datas.ErrorLog = ""

	// PostTitle := r.PostFormValue("title")
	// cat := r.PostForm["cat"]
	// content := r.PostFormValue("content")
	// post := models.Post{}
	// catids, errrr := helper.ParseCatId(cat)

	// file, header, errfile := r.FormFile("postimage")
	// user_id, errtu := strconv.Atoi(r.FormValue("user_id"))

	// var imagename string
	// if errfile == nil {
	// 	buffer := make([]byte, 512)
	// 	_, er := file.Read(buffer)
	// 	if er != nil {
	// 		// helper.ErrorPage(w, 500)
	// 		return
	// 	}
	// 	file.Seek(0, 0)

	// 	contentType := http.DetectContentType(buffer)
	// 	ImgExt := strings.Split(header.Filename, ".")
	// 	VAlinotdImg := len(ImgExt) <= 1 || !CheckExtension(ImgExt[len(ImgExt)-1]) || len(strings.Split(contentType, "/")[0]) <= 0 || strings.Split(contentType, "/")[0] != "image"

	// 	if VAlinotdImg {
	// 		// helper.ErrorPage(w, http.StatusBadRequest)
	// 		return
	// 	}
	// 	if float64(header.Size/1000000) >= 20.00 {
	// 		Datas.ErrorLog = "revoir taille du fichier"
	// 		return
	// 	}

	// 	errforc := os.MkdirAll("./static/img/posts", os.ModePerm)
	// 	imagename = fmt.Sprintf("%d-%s", time.Now().UnixNano(), header.Filename)
	// 	dst, errcre := os.Create(fmt.Sprintf("./static/img/posts/%s", imagename))
	// 	if errforc != nil || errcre != nil {
	// 		// helper.ErrorPage(w, 500)
	// 		return
	// 	}
	// 	_, errcopy := io.Copy(dst, file)
	// 	if errcopy != nil {
	// 		// helper.ErrorPage(w, 500)
	// 		return
	// 	}
	// }
	// if errtu != nil {
	// 	fmt.Println(errfile)
	// 	fmt.Println(errtu)
	// 	// helper.ErrorPage(w, http.StatusBadRequest)
	// 	return
	// }

	// var erri error
	// if len(PostTitle) > 0 && len(cat) > 0 && len(content) > 0 {
	// 	if errrr == nil && errtu == nil {
	// 		erri = post.InsertPost(DB, PostTitle, content, imagename, user_id, catids)
	// 	}
	// 	if erri != nil || errrr != nil || errtu != nil {
	// 		fmt.Println(erri)
	// 		fmt.Println(errrr)
	// 		fmt.Println(errtu)
	// 		// helper.ErrorPage(w, 404)
	// 		return
	// 	}
	// } else {
	// 	Datas.ErrorLog = "veiller remplir tous les champs"
	// }
	// http.Redirect(w, r, "/", 302)

}

func CheckExtension(ext string) bool {
	extensions := []string{"jpeg", "png", "gif","jpg"}
	for _, validExt := range extensions {
		if strings.ToLower(ext) == validExt {
			return true
		}
	}
	return false
}
