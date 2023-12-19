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


func (UserOne *User) GetOneUser(db *sql.DB, email string) error {
	req := `SELECT id,email,lastName,firthName, password,username from ` + Table + ` Where email=?;`
	row, err := db.Query(req, email)
	if err != nil {
		return err
	}
	for row.Next() {
		row.Scan(&UserOne.Id, &UserOne.Email, &UserOne.FirthName, &UserOne.LastName, &UserOne.Password, &UserOne.Username)
	}

	UserOne.Email = html.UnescapeString(UserOne.Email)
	UserOne.Username = html.UnescapeString(UserOne.Username)
	UserOne.FirthName = html.UnescapeString(UserOne.FirthName)
	UserOne.LastName = html.UnescapeString(UserOne.LastName)
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


