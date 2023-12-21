package helper

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gofrs/uuid"
)

var u1 = uuid.Must(uuid.NewV4())

func SetCookieInDB(w http.ResponseWriter) string {
	sssid := u1.String() + "-" + time.Now().GoString()
	cookie := http.Cookie{
		Name:     "sessionid",
		Value:    sssid,
		Expires:  time.Now().Add(time.Hour * 24 * 3),
		Path:     "/",
		MaxAge:   3600 * 24 * 3,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, &cookie)
	return sssid
}
func SessionAddOrUpdate(db *sql.DB, sssid, useremail string) error {
	req := `SELECT sessionId,email, expires_at from sessions Where email='` + useremail + `';`
	// req:=fmt.Sprintf(`SELECT * from Session Where email=?;`)
	row, err := db.Query(req)
	var sessionid, email string
	var expires_at time.Time
	var errsession error
	if err != nil {
		fmt.Println(err)
		return err
	}

	for row.Next() {
		row.Scan(&sessionid, &email, &expires_at)

	}

	if email == useremail {
		_, errsession = db.Exec("UPDATE sessions SET sessionId=?,  expires_at=? where email=?;", sssid, time.Now().Add(time.Hour*24*3), email)
	} else {
		_, errsession = db.Exec("INSERT INTO sessions (sessionId,email, expires_at) VALUES(?,?,?);", sssid, useremail, time.Now().Add(time.Hour*24*3))
	}
	return errsession

}

func Auth(Db *sql.DB, r *http.Request) (bool, string) {

	sessionpi, err := r.Cookie("sessionid")
	if err != nil || sessionpi.String() == "" {
		return false, ""
	}
	var Id int
	var sessionId, email string
	var expires_at time.Time
	req := `SELECT * from sessions Where sessionId=?;`
	row, err := Db.Query(req, sessionpi.Value)

	if err != nil {
		return false, ""
	}
	for row.Next() {
		row.Scan(&Id, &sessionId, &email, &expires_at)
	}

	if sessionId != "" && email != "" && expires_at.After(time.Now()) {
		return true, email
	}
	return false, ""
}
