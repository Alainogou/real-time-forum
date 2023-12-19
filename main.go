package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"realtimeforum/config"

	"realtimeforum/controllers"

	"github.com/rs/cors"
)

var (
	Port = ":8081"
)

func init() {
	fmt.Println("from init")
	var err error

	controllers.DB, err = config.GetDB()
	if err != nil {
		fmt.Println("connection database Error")
		os.Exit(0)
	}
	// req:=`
	// CREATE TABLE IF NOT EXISTS Session (
	// 	 id        integer  not null,
	// 	 sessionId varchar(250) ,
	// 	 email		varchar(250),
	// 	 datefin		TIMESTAMP,
	// 	 constraint PK_SESS primary key (id)
	//  );
	// `
	// _,erree:=controllers.DB.Exec(req)
	// if erree!=nil{
	// 	fmt.Println("Erreur lors de la creation de la table session")
	// 	os.Exit(0)
	// }

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

func getHandler(w http.ResponseWriter, r *http.Request) {
	// Handle GET request
	fmt.Fprintf(w, "GET request received")
}

func main() {

	static := http.FileServer(http.Dir("./assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", static))
	http.HandleFunc("/", HomeHandler)
	http.HandleFunc("/register", controllers.RegisterUser)
	http.HandleFunc("/login", controllers.LoginUser)

	fmt.Println("Server running on http://localhost" + Port)

	handler := cors.Default().Handler(http.DefaultServeMux)
	http.ListenAndServe(Port, handler)

	defer controllers.DB.Close()
}
