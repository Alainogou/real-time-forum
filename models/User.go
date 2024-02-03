package models

import (
	"database/sql"
	"fmt"
	"html"
	"strings"
	"time"

	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"
)

type UserWithLastMessage struct {
	*User
	LastMessageAt time.Time
}

type User struct {
	Id              int             `json:"Id"`
	NickName        string          `json:"NickName"`
	Email           string          `json:"Email"`
	LastName        string          `json:"LastName"`
	FirstName       string          `json:"FirstName"`
	Password        string          `json:"Password"`
	Age             int             `json:"Age"`
	Gender          string          `json:"Gender"`
	ConfirmPassword string          `json:"ConfirmPassword"`
	Status          string          `json:"Status"`
	Conn            *websocket.Conn `json:"Conn"`
	LastMessageAt   sql.NullTime    `json:"LastMessageAt"` // Ajouté pour stocker la date du dernier message

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
	row := db.QueryRow(req, email)

	err := row.Scan(&UserOne.Id, &UserOne.Age, &UserOne.NickName, &UserOne.Email, &UserOne.LastName, &UserOne.FirstName, &UserOne.Password, &UserOne.Gender)

	UserOne.Email = html.UnescapeString(UserOne.Email)
	UserOne.NickName = html.UnescapeString(UserOne.NickName)
	UserOne.Password = html.UnescapeString(UserOne.Password)
	UserOne.LastName = html.UnescapeString(UserOne.LastName)
	UserOne.FirstName = html.UnescapeString(UserOne.FirstName)

	return err
}

func (UserOne *User) GetOneUserWithNickName(db *sql.DB, nickName string) error {
	req := `SELECT id, age, nickName, email, lastName, firstName, password,  gender from ` + Table + ` Where nickName=?;`
	row := db.QueryRow(req, nickName)

	err := row.Scan(&UserOne.Id, &UserOne.Age, &UserOne.NickName, &UserOne.Email, &UserOne.LastName, &UserOne.FirstName, &UserOne.Password, &UserOne.Gender)

	UserOne.Email = html.UnescapeString(UserOne.Email)
	UserOne.NickName = html.UnescapeString(UserOne.NickName)
	UserOne.Password = html.UnescapeString(UserOne.Password)
	UserOne.LastName = html.UnescapeString(UserOne.LastName)
	UserOne.FirstName = html.UnescapeString(UserOne.FirstName)

	return err
}

func GetAllUser(db *sql.DB) ([]*User, error) {
	req := `SELECT id, age, nickName, email, lastName, firstName, password, gender FROM ` + Table
	rows, err := db.Query(req)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Age, &user.NickName, &user.Email, &user.LastName, &user.FirstName, &user.Password, &user.Gender)
		if err != nil {
			return nil, err
		}

		user.Email = html.UnescapeString(user.Email)
		user.NickName = html.UnescapeString(user.NickName)
		user.Password = html.UnescapeString(user.Password)
		user.LastName = html.UnescapeString(user.LastName)
		user.FirstName = html.UnescapeString(user.FirstName)

		users = append(users, &user)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
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

// func GetAllUsersWithLastMessage(db *sql.DB) ([]UserWithLastMessage, error) {
// 	query := `
//     SELECT u.id, GREATEST(MAX(m1.createdDate), MAX(m2.createdDate)) AS lastMessageAt
//     FROM user u
//     LEFT JOIN message m1 ON u.id = m1.fromUser
//     LEFT JOIN message m2 ON u.id = m2.toUser
//     GROUP BY u.id;
//     `
//     rows, err := db.Query(query)
//     if err != nil {
//         return nil, err
//     }
//     defer rows.Close()

// 	var usersWithLastMessage []UserWithLastMessage

//     for rows.Next() {
//         var user User
//         var lastMessageAt sql.NullTime // Utilisez sql.NullTime pour gérer les cas où il n'y a pas de messages
//         if err := rows.Scan(&user.Id, &lastMessageAt); err != nil {
//             return nil, err
//         }
//         userWithLastMsg := UserWithLastMessage{
//             User: &user,
//         }
//         if lastMessageAt.Valid {
//             userWithLastMsg.LastMessageAt = lastMessageAt.Time
//         }
//         usersWithLastMessage = append(usersWithLastMessage, userWithLastMsg)
//     }
//     if err = rows.Err(); err != nil {
//         return nil, err
//     }

// 	// Trier les utilisateurs
// 	sort.Slice(usersWithLastMessage, func(i, j int) bool {
// 		if usersWithLastMessage[i].LastMessageAt.IsZero() && usersWithLastMessage[j].LastMessageAt.IsZero() {
// 			return usersWithLastMessage[i].NickName < usersWithLastMessage[j].NickName
// 		}
// 		if usersWithLastMessage[i].LastMessageAt.IsZero() {
// 			return false
// 		}
// 		if usersWithLastMessage[j].LastMessageAt.IsZero() {
// 			return true
// 		}
// 		return usersWithLastMessage[i].LastMessageAt.After(usersWithLastMessage[j].LastMessageAt)
// 	})

// 	fmt.Println(usersWithLastMessage)
// 	return usersWithLastMessage, nil
// }

// func GetLastMessageDate(db *sql.DB, userID int) (sql.NullTime, error) {
// 	var lastMessageAt sql.NullTime
// 	query := `
//     SELECT GREATEST(MAX(m1.createdDate), MAX(m2.createdDate))
//     FROM message m1
//     LEFT JOIN message m2 ON m1.toUser = m2.fromUser
//     WHERE m1.fromUser = ? OR m2.toUser = ?
//     `
// 	err := db.QueryRow(query, userID, userID).Scan(&lastMessageAt)
// 	if err != nil {
// 		return sql.NullTime{}, err
// 	}
// 	return lastMessageAt, nil
// }

// func GetAllUsersWithLastMessage(db *sql.DB) ([]*User, error) {
// 	users, err := GetAllUser(db)
// 	fmt.Println("Utilisateurs récupérés:", users) // Pour vérifier les utilisateurs récupérés

// 	if err != nil {
// 		return nil, err
// 	}

// 	for _, user := range users {
// 		lastMessageAt, err := GetLastMessageDate(db, user.Id)
// 		// Après avoir appelé GetLastMessageDate pour chaque utilisateur
// fmt.Println("Date du dernier message pour l'utilisateur", user.Id, ":", lastMessageAt)

// 		if err != nil {
// 			return nil, err
// 		}
// 		user.LastMessageAt = lastMessageAt
// 	}

// 	// Trier les utilisateurs ici si nécessaire
// 	// Après avoir mis à jour tous les utilisateurs avec leur date de dernier message
// 	sort.Slice(users, func(i, j int) bool {
// 		// Si les deux utilisateurs n'ont pas de dernier message, triez-les par NickName
// 		if users[i].LastMessageAt.Valid == false && users[j].LastMessageAt.Valid == false {
// 			return users[i].NickName < users[j].NickName
// 		}
// 		// Si l'un des utilisateurs n'a pas de dernier message, il vient après celui qui en a un
// 		if users[i].LastMessageAt.Valid == false {
// 			return false
// 		}
// 		if users[j].LastMessageAt.Valid == false {
// 			return true
// 		}
// 		// Sinon, triez les utilisateurs par la date de leur dernier message, du plus récent au plus ancien
// 		return users[i].LastMessageAt.Time.After(users[j].LastMessageAt.Time)

// 	})

// 	// Après le tri
// 	fmt.Println("Utilisateurs triés:", users)

// 	// fmt.Println(users)
// 	return users, nil
// }
