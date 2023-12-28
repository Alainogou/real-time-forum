package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

func LogoutUser(w http.ResponseWriter, r *http.Request) {
	ok, _ := CheckRequest(r, "/logout", "post")

	if !ok {
		fmt.Println("errologout")
		return
	}
	session, err := r.Cookie("sessionid")

	errDelete := DeleteSession(DB, session.Value)
	if errDelete != nil || err != nil {
		fmt.Println("delete session error")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:  session.Name,
		Value: "",
		Path:  session.Path,
	})

}

func DeleteSession(db *sql.DB, ssid string) error {
	req := `DELETE from sessions Where sessionId=?;`
	_, err := db.Exec(req, ssid)
	return err
}

func CheckRequest(r *http.Request, path, methode string) (bool, int) {
	if strings.ToLower(r.Method) == methode && r.URL.Path == path {
		return true, 0
	} else if !Getmethode(r, methode) {
		return false, 405
	} else {
		return false, 404
	}
}

func Getmethode(r *http.Request, methode string) bool {
	if strings.ToLower(r.Method) != methode {
		return false
	}
	return true
}
