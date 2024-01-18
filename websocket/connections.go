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
	Id       int    `json:"Id"`
	NickName string `json:"NickName"`
	Status   string `json:"Status"`
}

type AllUserStatus struct {
	AllUser []UserStatus `json:"AllUser"`
}

var UsersMap = make(map[string]*models.User)
var UsersMapMutex sync.Mutex

// var ConnectionsArray []*websocket.Conn
// var ConnectionsArrayMutex sync.Mutex

var allUserStatus AllUserStatus
var userExist []string

func HandleConnections(w http.ResponseWriter, r *http.Request, db *sql.DB) {

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
	}
	defer ws.Close()

	// ConnectionsArrayMutex.Lock()
	// ConnectionsArray = append(ConnectionsArray, ws)
	// ConnectionsArrayMutex.Unlock()

	// fmt.Println(ConnectionsArray)

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

		userSlice, _ := models.GetAllUser(db)

		userConnect := []UserStatus{}

		for i := 0; i < len(userSlice); i++ {
			_, ok := UsersMap[userSlice[i].NickName]
			if ok {
				userConnect = append(userConnect, UserStatus{NickName: userSlice[i].NickName, Id: userSlice[i].Id, Status: "online"})
			} else {
				userConnect = append(userConnect, UserStatus{NickName: userSlice[i].NickName, Id: userSlice[i].Id, Status: "offLine"})

			}

		}
		fmt.Println(userConnect)
		// Envoyer un message au client
		allUserStatus = AllUserStatus{AllUser: userConnect}
		Broadcast(allUserStatus, userExist, receivedMsg.NickName)
		fmt.Println("ok", userExist)
	}
}

func RemoveUserFromMap(username string) {
	UsersMapMutex.Lock()
	defer UsersMapMutex.Unlock()

	delete(UsersMap, username)
	for i := 0; i < len(allUserStatus.AllUser); i++ {
		if allUserStatus.AllUser[i].NickName == username {
			allUserStatus.AllUser[i].Status = "OffLine"
		}
	}
	userExist = removeString(userExist, username)
	fmt.Println("user here", userExist)
	Broadcast(allUserStatus, userExist, username)
}

func Broadcast(allUserStatus AllUserStatus, userexist []string, userName string) {
	for k := 0; k < len(userexist); k++ {
		if userexist[k] == userName {
			removeUserStatus(&allUserStatus, userName)
		}
		jsonMsg, _ := json.Marshal(allUserStatus)
		conn := UsersMap[userExist[k]].Conn
		err := conn.WriteMessage(websocket.TextMessage, jsonMsg)
		if err != nil {
			fmt.Println("write:", err)
			return
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

func removeUserStatus(allUserStatus *AllUserStatus, nickName string) {
	for i, userStatus := range allUserStatus.AllUser {
		if userStatus.NickName == nickName {
			allUserStatus.AllUser = append(allUserStatus.AllUser[:i], allUserStatus.AllUser[i+1:]...)
			break
		}
	}
}

// func handleConnectisons(w http.ResponseWriter, r *http.Request) {
// 	ws, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	defer ws.Close()
// 	for {
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

// 		jsonMsg, _ := json.Marshal(receivedMsg)
// 		err = ws.WriteMessage(websocket.TextMessage, jsonMsg)
// 		if err != nil {
// 			fmt.Println("write:", err)
// 			return
// 		}
// 		fmt.Println("Received message:", receivedMsg.NickName)
// 	}
// 	// for {

// 	// 	messageType, msg, err := ws.ReadMessage()

// 	// 	fmt.Println(string(msg))
// 	// 	if err != nil {

// 	// 		fmt.Println("errroe", err)

// 	// 		break
// 	// 	}
// 	// 	if err := ws.WriteMessage(messageType, msg); err != nil {
// 	// 		fmt.Println(err)
// 	// 		break
// 	// 	}
// 	// }
// }
