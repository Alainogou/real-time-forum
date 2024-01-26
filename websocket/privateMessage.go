package wbs

import (
	"database/sql"
	"fmt"
	"net/http"
	"realtimeforum/models"
	"time"

	"encoding/json"

	"github.com/gorilla/websocket"
)

type MessageJson struct {
	FromUser       string    `json:"FromUser"`
	ContentMessage string    `json:"Message"`
	ToUser         string    `json:"ToUser"`
	CreateDate     time.Time `json:"CreateDate"`
}

var MessageConnection = make(map[string]*websocket.Conn)

func sHandlePrivateMessage(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	userFrom := r.URL.Query().Get("userFrom")
	toUser := r.URL.Query().Get("toUser")
	fmt.Println(userFrom, toUser)
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
	}
	defer ws.Close()

	message := models.MessageSender{}
	user_forum, err := models.GetMessage(db, userFrom, toUser)
	user_receiver, err1 := models.GetMessage(db, toUser, userFrom)

	if err != nil || err1 != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	message.UserForum = user_forum
	message.UserReceiver = user_receiver
	jsonMsg, _ := json.Marshal(message)
	err = ws.WriteMessage(websocket.TextMessage, jsonMsg)
	if err != nil {
		fmt.Println("write:", err)
		return
	}

	for {

		// MessageConnection[userFrom] = ws
		// fmt.Println(MessageConnection)
		// Broad(userFrom, toUser, db, ws)

		// // Recevoir un message du client
		// _, msg, err := ws.ReadMessage()
		// if err != nil {
		// 	fmt.Println("read:", err)

		// 	return
		// }

		// var receivedMsg MessageJson
		// err = json.Unmarshal(msg, &receivedMsg)
		// if err != nil {
		// 	fmt.Println("unmarshal:", err)
		// 	return
		// }

		// // fmt.Println("mess", messengers)
		// com := models.MessagePrivate{}
		// errinsert := com.InsertMessage(db, receivedMsg.FromUser, receivedMsg.ToUser, receivedMsg.ContentMessage, receivedMsg.CreateDate)
		// if errinsert != nil {
		// 	fmt.Println(errinsert)
		// 	// helper.ErrorPage(w, 500)
		// 	return
		// }

	}
}

func HandlePrivateMessage(w http.ResponseWriter, r *http.Request, db *sql.DB) {

	userFrom := r.URL.Query().Get("userFrom")
	toUser := r.URL.Query().Get("toUser")
	fmt.Println(userFrom, toUser)
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
	}
	defer ws.Close()
	err = models.MarkMessagesAsRead(db, toUser, userFrom)
	if err != nil {
		fmt.Println("error to udapte at message is read")
	}

	for {
		MessageConnection[userFrom] = ws

		Broad(userFrom, toUser, db)
		// Recevoir un message du client
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("read:", err)

			return
		}

		var receivedMsg MessageJson
		err = json.Unmarshal(msg, &receivedMsg)
		if err != nil {
			fmt.Println("unmarshal:", err)
			return
		}

		fmt.Println("mess", receivedMsg)
		com := models.MessagePrivate{}
		if receivedMsg.ContentMessage != "" {
			errinsert := com.InsertMessage(db, receivedMsg.FromUser, receivedMsg.ToUser, receivedMsg.ContentMessage, receivedMsg.CreateDate)
			if errinsert != nil {
				fmt.Println(errinsert)
				// helper.ErrorPage(w, 500)
				return
			}

		}

		fmt.Println(MessageConnection)
		// Broad(userFrom, toUser, db, ws)

	}
}

func Broad(userFrom, toUser string, db *sql.DB) {

	message := models.MessageSender{}
	user_forum, err := models.GetMessage(db, userFrom, toUser)
	user_receiver, err1 := models.GetMessage(db, toUser, userFrom)

	if err != nil || err1 != nil {
		fmt.Println("yo error")
		return
	}
	message.UserForum = user_forum
	message.UserReceiver = user_receiver
	jsonMsg, err := json.Marshal(message)
	if err != nil {
		fmt.Println("write:", err)
		return
	}
	conn := MessageConnection[userFrom]
	err = conn.WriteMessage(websocket.TextMessage, jsonMsg)

	if err != nil {
		fmt.Println("write:", err)
		return
	}

	fmt.Println("bOOOL", IsUserConnected(toUser))
	if IsUserConnected(toUser) {

		user_forum, _ = models.GetMessage(db, toUser, userFrom)
		user_receiver, _ = models.GetMessage(db, userFrom, toUser)
		message.UserForum = user_forum
		message.UserReceiver = user_receiver
		message.NewMessage = true
		jsonMsg, err := json.Marshal(message)
		if err != nil {
			fmt.Println("write:", err)
			return
		}
		conn = MessageConnection[toUser]
		err = conn.WriteMessage(websocket.TextMessage, jsonMsg)

		if err != nil {
			fmt.Println("write:", err)
			return
		}
	}

}

func IsUserConnected(username string) bool {
	_, exists := MessageConnection[username]
	return exists
}
