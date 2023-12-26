package controllers

import (
	// "fmt"
	"database/sql"
	
    "time"
	"net/http"
	"fmt"

	"encoding/json"
	"realtimeforum/models"
	

	
)

type authInfo struct {
	IsAuth     bool `json:"IsAuth"`
	User  models.User    `json:"User"`
	
}

func IsAuth(w http.ResponseWriter, r *http.Request) {

	isConnect, email:=Auth(DB, r)
	userConnect:=models.User{}
	er:=userConnect.GetOneUser(DB, email)
	
	if er!=nil{
		fmt.Println(er)
		
	}
	
	info:=authInfo{
		IsAuth:isConnect, 
		User: userConnect,
	}

	err := json.NewEncoder(w).Encode(info)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}



func Auth(Db *sql.DB, r *http.Request) (bool, string) {

	sessionpi, err := r.Cookie("sessionid")
	if err != nil || sessionpi.String() == "" {
		return false, ""
	}
	var Id int
	var sessionId, email string
	var datef time.Time
	req := `SELECT * from sessions Where sessionId=?;`
	row, err := Db.Query(req, sessionpi.Value)

	if err != nil {
		return false, ""
	}
	for row.Next() {
		row.Scan(&Id, &sessionId, &email, &datef)
	}

	if sessionId != "" && email != "" && datef.After(time.Now()) {
		return true, email
	}
	return false, ""
}