package wbs

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

type ChatMessage struct {
	Sender    string `json:"sender"`
	Recipient string `json:"recipient"`
	Received  string `json:"received"`
}

// Send Message to all Users
func BroadcastChatMessage(chatMessage ChatMessage) {
	jsonMsg, _ := json.Marshal(chatMessage)
	for _, user := range UsersMap {
		err := user.Conn.WriteMessage(websocket.TextMessage, jsonMsg)
		if err != nil {
			fmt.Println("write:", err)
			return
		}
	}
}
