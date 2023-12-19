package models

import (
	"database/sql"
	"fmt"
	"strings"
	"time"
	"html"
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


func (UserOne *User) GetOneUser(db *sql.DB, email string) error {
	req := `SELECT id, age, nickName, email, lastName, firstName, password,  gender from ` + Table + ` Where email=?;`
	row, err := db.Query(req, email)
	if err != nil {
		return err
	}
	for row.Next() {
		row.Scan(&UserOne.Id, &UserOne.Age, &UserOne.NickName, &UserOne.Email, &UserOne.LastName, &UserOne.FirstName, &UserOne.Password, &UserOne.Gender)
	}

	UserOne.Email = html.UnescapeString(UserOne.Email)
	UserOne.NickName= html.UnescapeString(UserOne.NickName)
	UserOne.Password = html.UnescapeString(UserOne.Password)
	UserOne.LastName = html.UnescapeString(UserOne.LastName)
	UserOne.FirstName= html.UnescapeString(UserOne.FirstName)
	errr := row.Err()
	return errr
}

func (UserOne *User) GetOneUserWithNickName(db *sql.DB, NickName string) error {
	req := `SELECT id, age, nickName, email, lastName, firstName, password,  gender from ` + Table + ` Where nickName=?;`
	row, err := db.Query(req, NickName)
	if err != nil {
		return err
	}
	for row.Next() {
		row.Scan(&UserOne.Id, &UserOne.Age, &UserOne.NickName, &UserOne.Email, &UserOne.LastName, &UserOne.FirstName, &UserOne.Password, &UserOne.Gender)
	}

	UserOne.Email = html.UnescapeString(UserOne.Email)
	UserOne.NickName= html.UnescapeString(UserOne.NickName)
	UserOne.Password = html.UnescapeString(UserOne.Password)
	UserOne.LastName = html.UnescapeString(UserOne.LastName)
	UserOne.FirstName= html.UnescapeString(UserOne.FirstName)
	errr := row.Err()
	return errr
}

func SelectOneData(db *sql.DB) (User, error) {
	return User{}, nil
}

func UpdateOne(db *sql.DB) (User, error) {
	return User{}, nil
}

func DeleteOne(db *sql.DB) (User, error) {
	return User{}, nil
}

func IsUserExist(db *sql.DB, email string) (string, error) {
	var userEmail string

	query := "SELECT email FROM User WHERE email = ?"
	err := db.QueryRow(query, email).Scan(&userEmail)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		} else {
			return "", err
		}
	}

	return userEmail, nil
}


