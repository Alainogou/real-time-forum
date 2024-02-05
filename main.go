package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"realtimeforum/config"
	"realtimeforum/controllers"
	wbs "realtimeforum/websocket"
	"time"

	"github.com/rs/cors"
)

var (
	Port = ":8081"
)

const currentTime = "2006-01-02 15:04:05"

// ASCI esacpe codes for colors
const (
	Reset   = "\033[0m"
	Red     = "\033[31m"
	Green   = "\033[32m"
	Yellow  = "\033[33m"
	Blue    = "\033[34m"
	Magenta = "\033[35m"
	Cyan    = "\033[36m"
	White   = "\033[37m"
	Purple  = "\033[95m"
	Dark    = "\033[90m"
)

// InitMessage prints a message when the server starts
func InitMessage() {
	fmt.Printf(Cyan + "===============================================\n" + Reset)
	fmt.Printf(Magenta + "Starting Realtime forum\n" + Reset)
	fmt.Printf(Magenta + "Server running on " + Green + "http://localhost" + Port + "\n" + Reset)
	fmt.Printf(Magenta + "Server started at: " + Blue + time.Now().Format(currentTime) + "\n" + Reset)
	fmt.Printf(Magenta + "Write" + Blue + " status" + Reset + Magenta + " to see loged in users\n" + Reset)
	fmt.Printf(Magenta + "Press Ctrl+C to stop the server\n" + Reset)
	fmt.Printf(Cyan + "===============================================\n" + Reset)
}

func init() {

	var err error

	controllers.DB, err = config.GetDB()
	if err != nil {
		fmt.Println("connection database Error")
		os.Exit(0)
	}

}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		return
	}

	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		fmt.Println("Parsing error")
		return
	}

	err = tmpl.Execute(w, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// func getHandler(w http.ResponseWriter, r *http.Request) {
// 	// Handle GET request
// 	fmt.Fprintf(w, "GET request received")
// }

func main() {
	InitMessage()
	static := http.FileServer(http.Dir("./assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", static))
	http.HandleFunc("/", HomeHandler)
	http.HandleFunc("/register", controllers.RegisterUser)
	http.HandleFunc("/login", controllers.LoginUser)
	http.HandleFunc("/auth", controllers.IsAuth)
	http.HandleFunc("/logout", controllers.LogoutUser)
	http.HandleFunc("/createPost", controllers.CreatePost)
	// http.HandleFunc("/createPost", controllers.CommentPost)
	http.HandleFunc("/fetchPost", controllers.GetPosts)
	http.HandleFunc("/createComment", controllers.CreateComment)
	http.HandleFunc("/fetchComment/", controllers.GetComments)
	
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wbs.HandleConnections(w, r, controllers.DB)
	})
	http.HandleFunc("/communication", func(w http.ResponseWriter, r *http.Request) {
		wbs.HandleCommunications(w, r, controllers.DB)
	})

	http.HandleFunc("/privateSocket", func(w http.ResponseWriter, r *http.Request) {
		wbs.HandlePrivateMessage(w, r, controllers.DB)
	})

	handler := cors.Default().Handler(http.DefaultServeMux)
	http.ListenAndServe(Port, handler)

	defer controllers.DB.Close()

}
