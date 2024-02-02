package wbs

import (
	"database/sql"
	"fmt"
	"net/http"
	"realtimeforum/models"

	"encoding/json"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Message struct {
	NickName string `json:"NickName"`
}

type UserStatus struct {
	Id           int    `json:"Id"`
	NickName     string `json:"NickName"`
	Status       string `json:"Status"`
	NbreMessages int    `json:"NbreMessages"`
}

type AllUserStatus struct {
	AllUser         []UserStatus `json:"AllUser"`
	NewMessage      bool         `json:"NewMessage"`
	NewConnection   bool         `json:"NewConnection"`
	NewDeconnexion  bool         `json:"NewDeconnexion"`
	PersonConnected string       `json:"PersonConnected"`
}

var UsersMap = make(map[string]*models.User)
var UsersMapMutex sync.Mutex

var allUserStatus AllUserStatus
var userExist []string
var UserSlice []*models.User

func HandleConnections(w http.ResponseWriter, r *http.Request, db *sql.DB) {

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
	}
	defer ws.Close()

	for {

		// Recevoir un message du client
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("read:", err)

			return
		}

		var receivedMsg Message
		err = json.Unmarshal(msg, &receivedMsg)
		if err != nil {
			fmt.Println("unmarshal:", err)
			return
		}

		oneUser := &models.User{}
		err = oneUser.GetOneUserWithNickName(db, receivedMsg.NickName)
		oneUser.Status = "online"
		oneUser.Conn = ws
		if err != nil {
			fmt.Println("get user")
		}
		if !IsUserExist(receivedMsg.NickName) {
			userExist = append(userExist, receivedMsg.NickName)
		}

		UsersMap[receivedMsg.NickName] = oneUser

		UserSlice, _ = models.GetAllUser(db)

		userConnect := []UserStatus{}

		for i := 0; i < len(UserSlice); i++ {
			_, ok := UsersMap[UserSlice[i].NickName]

			count, err := models.CountUnreadMessages(db, UserSlice[i].NickName, receivedMsg.NickName)
			if err != nil {
				fmt.Println("error to give count read messages")
			}

			if ok {
				userConnect = append(userConnect, UserStatus{NickName: UserSlice[i].NickName, Id: UserSlice[i].Id, Status: "online", NbreMessages: count})
			} else {
				userConnect = append(userConnect, UserStatus{NickName: UserSlice[i].NickName, Id: UserSlice[i].Id, Status: "offLine", NbreMessages: count})

			}

		}

		// Envoyer un message au client

		allUserStatus = AllUserStatus{AllUser: userConnect}
		jsonMsg, _ := json.Marshal(allUserStatus)

		err = ws.WriteMessage(websocket.TextMessage, jsonMsg)
		if err != nil {
			fmt.Println("write:", err)
			return
		}
		_all := AllUserStatus{}
		BroadcastConnexion(_all, userExist, receivedMsg.NickName, db)

	}
}

func RemoveUserFromMap(username string, db *sql.DB) {
	UsersMapMutex.Lock()
	defer UsersMapMutex.Unlock()

	delete(UsersMap, username)

	for i := 0; i < len(UserSlice); i++ {
		if username != UserSlice[i].NickName {
			delete(MessageConnection, username+UserSlice[i].NickName)
			delete(PersonOpenChat, username+UserSlice[i].NickName)
		}
	}

	for i := 0; i < len(allUserStatus.AllUser); i++ {
		if allUserStatus.AllUser[i].NickName == username {
			allUserStatus.AllUser[i].Status = "OffLine"
		}
	}
	userExist = removeString(userExist, username)

	BroadcastDeconnexion(userExist, username, db)
}

func BroadcastConnexion(allUserStatus AllUserStatus, userexist []string, userName string, db *sql.DB) {
	for k := 0; k < len(userexist); k++ {
		if userexist[k] != userName {
			allUserStatus.NewConnection = true
			allUserStatus.PersonConnected = userName
			jsonMsg, _ := json.Marshal(allUserStatus)
			conn := UsersMap[userExist[k]].Conn
			err := conn.WriteMessage(websocket.TextMessage, jsonMsg)
			if err != nil {
				fmt.Println("write:", err)
				return
			}
		}

	}
}

func BroadcastDeconnexion(userexist []string, userName string, db *sql.DB) {
	_all := AllUserStatus{}
	for k := 0; k < len(userexist); k++ {
		if userexist[k] != userName {
			_all.NewDeconnexion = true
			_all.PersonConnected = userName
			jsonMsg, _ := json.Marshal(_all)
			conn := UsersMap[userExist[k]].Conn
			err := conn.WriteMessage(websocket.TextMessage, jsonMsg)
			if err != nil {
				fmt.Println("write:", err)
				return
			}
		}

	}
}

func IsUserExist(str string) bool {
	for p := 0; p < len(userExist); p++ {
		if userExist[p] == str {
			return true
		}
	}
	return false

}

func removeString(slice []string, s string) []string {
	for i, v := range slice {
		if v == s {
			return append(slice[:i], slice[i+1:]...)
		}
	}
	return slice
}

// func HandleConnections(w http.ResponseWriter, r *http.Request, db *sql.DB) {

// 	ws, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	defer ws.Close()

// 	for {
// 		// Recevoir un message du client
// 		_, msg, err := ws.ReadMessage()
// 		if err != nil {
// 			fmt.Println("read:", err)

// 			return
// 		}

// 		var receivedMsg Message
// 		err = json.Unmarshal(msg, &receivedMsg)
// 		if err != nil {
// 			fmt.Println("unmarshal:", err)
// 			return
// 		}

// 		oneUser := &models.User{}
// 		err = oneUser.GetOneUserWithNickName(db, receivedMsg.NickName)
// 		oneUser.Status = "online"
// 		oneUser.Conn = ws
// 		if err != nil {
// 			fmt.Println("get user")
// 		}
// 		if !IsUserExist(receivedMsg.NickName) {

// 			userExist = append(userExist, receivedMsg.NickName)
// 		}

// 		UsersMap[receivedMsg.NickName] = oneUser

// 		UserSlice, _ = models.GetAllUser(db)

// 		userConnect := []UserStatus{}

// 		for i := 0; i < len(UserSlice); i++ {
// 			_, ok := UsersMap[UserSlice[i].NickName]

// 			if ok {
// 				userConnect = append(userConnect, UserStatus{NickName: UserSlice[i].NickName, Id: UserSlice[i].Id, Status: "online"})
// 			} else {
// 				userConnect = append(userConnect, UserStatus{NickName: UserSlice[i].NickName, Id: UserSlice[i].Id, Status: "offLine"})

// 			}

// 		}

// 		// Envoyer un message au client
// 		allUserStatus = AllUserStatus{AllUser: userConnect}
// 		Broadcast(allUserStatus, userExist, receivedMsg.NickName, db)

// 	}
// }

// func RemoveUserFromMap(username string, db *sql.DB) {
// 	UsersMapMutex.Lock()
// 	defer UsersMapMutex.Unlock()

// 	delete(UsersMap, username)
// 	for i := 0; i < len(allUserStatus.AllUser); i++ {
// 		if allUserStatus.AllUser[i].NickName == username {
// 			allUserStatus.AllUser[i].Status = "OffLine"
// 		}
// 	}
// 	userExist = removeString(userExist, username)

// 	Broadcast(allUserStatus, userExist, username, db)
// }

// func Broadcast(allUserStatus AllUserStatus, userexist []string, userName string, db *sql.DB) {
// 	for k := 0; k < len(userexist); k++ {

// 		for i := 0; i < len(UserSlice); i++ {

// 			count, err := models.CountUnreadMessages(db, UserSlice[i].NickName, userexist[k])
// 			if err != nil {
// 				fmt.Println("error to give count read messages")

// 			}
// 			allUserStatus.AllUser[i].NbreMessages = count

// 		}
// 		jsonMsg, _ := json.Marshal(allUserStatus)
// 		conn := UsersMap[userExist[k]].Conn
// 		err := conn.WriteMessage(websocket.TextMessage, jsonMsg)
// 		if err != nil {
// 			fmt.Println("write:", err)
// 			return
// 		}

// 	}
// }

// func IsUserExist(str string) bool {
// 	for p := 0; p < len(userExist); p++ {
// 		if userExist[p] == str {
// 			return true
// 		}
// 	}
// 	return false

// }

// func removeString(slice []string, s string) []string {
// 	for i, v := range slice {
// 		if v == s {
// 			return append(slice[:i], slice[i+1:]...)
// 		}
// 	}
// 	return slice
// }
