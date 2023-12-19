package controllers

import (
	// "fmt"
	
	"realtimeforum/models"
	"html"
	"net/http"
	
	"io/ioutil"
	"fmt"
	

	"encoding/json"
	// "strings"
	// "time"

	// // "github.com/gofrs/uuid"

	// "github.com/gofrs/uuid"
	// "golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	
	EmailOrUsername  string `json:"EmailOrUsername"`
	Password  string `json:"Password"`
	
}



// var u1 = uuid.Must(uuid.NewV4())
// var Datas = UserData{}

func LoginUser(w http.ResponseWriter, r *http.Request) {

	newLog := LoginRequest{}
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
	}
	err = json.Unmarshal(reqBody, &newLog )
	
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	user1 := models.User{}

	var  errMail error
	var  errNickname error

    if isEmailValid(newLog.EmailOrUsername){
		errMail= user1.GetOneUser(DB, html.EscapeString(newLog.EmailOrUsername))
		fmt.Println("ici", user1,  errMail)
	}

	user2 := models.User{}
	errNickname= user2.GetOneUserWithNickName(DB, html.EscapeString(newLog.EmailOrUsername))
	fmt.Println("user2", user2, errNickname)

	
	if (errMail==nil && errNickname==nil){
		if (user1.Email==user2.Email){

		}else{
			// errorMessage
		}
	}else if (errMail==nil && errNickname!=nil){

	}else if (errMail!=nil && errNickname==nil){

	}else{
		// errorMessage
	}
	// Error = ""
	// // Datas.IsAuth = false
	// if strings.ToLower(r.Method) == "get" {
	// 	// err := helper.RenderTemplateWithLoyout(w, "pages/login", Datas)
	// 	// Datas = UserData{}
	// 	// if err != nil {
	// 	// 	helper.ErrorPage(w, 404)
	// 	// 	fmt.Println(err)
	// 	// 	return
	// 	// }
	// } else if strings.ToLower(r.Method) == "post" {

		

	// 	// user := models.User{}
	// 	// errr := user.GetOneUser(DB, html.EscapeString(email))

	// 	// if errr != nil {
	// 	// 	fmt.Println(errr)
	// 	// 	// helper.ErrorPage(w, 500)
	// 	// 	return
	// 	// }

	// 	ispassword := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	// 	if ispassword != nil {
	// 		// Datas.ErrorLog = "Invalid email or password"
	// 		// time.Sleep(2 * time.Second)
	// 		// http.Redirect(w, r, "/login", 302)
	// 		return
	// 	} else {

	// 		// sssid := helper.SetCookieInDB(w)
	// 		// errss := helper.SessionAddOrUpdate(DB, sssid, user.Email)
	// 		// if errss != nil {
	// 		// 	fmt.Println(errss)
	// 		// 	helper.ErrorPage(w, 500)
	// 		// 	return
	// 		// }
	// 		// Datas.ErrorLog = ""
	// 		// http.Redirect(w, r, "/", 302)
	// 		// sssid = ""
	// 		// return
	// 	}
	// } else {
	// 	// helper.ErrorPage(w, 405)
	// }
}

