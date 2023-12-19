package controllers

import (
	"fmt"
	helper "forum/helpers"
	"forum/models"
	"html"
	"net/http"
	"strings"
	"time"

	// "github.com/gofrs/uuid"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

var u1 = uuid.Must(uuid.NewV4())
var Datas = UserData{}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	Error = ""
	Datas.IsAuth = false
	if strings.ToLower(r.Method) == "get" {
		err := helper.RenderTemplateWithLoyout(w, "pages/login", Datas)
		Datas = UserData{}
		if err != nil {
			helper.ErrorPage(w, 404)
			fmt.Println(err)
			return
		}
	} else if strings.ToLower(r.Method) == "post" {

		erf := r.ParseForm()
		if erf != nil {
			helper.ErrorPage(w, 500)
			return
		}
		email := r.FormValue("email")
		password := r.FormValue("password")

		user := models.User{}
		errr := user.GetOneUser(DB, html.EscapeString(email))

		if errr != nil {
			fmt.Println(errr)
			helper.ErrorPage(w, 500)
			return
		}

		ispassword := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

		if ispassword != nil {
			Datas.ErrorLog = "Invalid email or password"
			time.Sleep(2 * time.Second)
			http.Redirect(w, r, "/login", 302)
			return
		} else {

			sssid := helper.SetCookieInDB(w)
			errss := helper.SessionAddOrUpdate(DB, sssid, user.Email)
			if errss != nil {
				fmt.Println(errss)
				helper.ErrorPage(w, 500)
				return
			}
			Datas.ErrorLog = ""
			http.Redirect(w, r, "/", 302)
			sssid = ""
			return
		}
	} else {
		helper.ErrorPage(w, 405)
	}
}

