package models

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/gofrs/uuid"
)

type User struct {
	Id        int `json:"Id"`
	NickName  string `json:"NickName"`
	Email     string `json:"Email"`
	LastName  string `json:"LastName"`
	FirstName  string `json:"FirstName"`
	Password  string `json:"Password"`
	Age 	  int	 `json:"Age"`
	Gender    string `json:"Gender"`
	ConfirmPassword string `json:"ConfirmPassword"`
}

type Session struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	ExpiresAt time.Time
	CreatedAt time.Time
}
var Table = "user"


func (us *User) InsertData(db *sql.DB, age int, data ...string) error {
	req := fmt.Sprintf("INSERT INTO %s (age, nickName, email, lastName, firstName, password,  gender) VALUES(%d, '%s')", Table, age, strings.Join(data, "','"))
	dat, err := db.Prepare(req)
	if err != nil {
		return err
	}
	result, er := dat.Exec()
	fmt.Println(result)
	return er
}