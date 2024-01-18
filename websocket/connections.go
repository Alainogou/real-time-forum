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
		if err != nil {
			fmt.Println("get user")
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
		allUserStatus := AllUserStatus{AllUser: userConnect}

		jsonMsg, _ := json.Marshal(allUserStatus)
		err = ws.WriteMessage(websocket.TextMessage, jsonMsg)
		if err != nil {
			fmt.Println("write:", err)
			return
		}
	}
}

func RemoveUserFromMap(username string) {
	UsersMapMutex.Lock()
	defer UsersMapMutex.Unlock()

	delete(UsersMap, username)
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
