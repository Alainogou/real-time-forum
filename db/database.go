package main

import (
	// "database/sql"
	"math/rand"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func randomInt(length int) string {
	const charset = "012"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func randmId(length int) string {
	const charset = "12345"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func main() {
	// db, err := sql.Open("sqlite3", "db.sqlite")
	// if err != nil {
	// 	panic(err)
	// }
	// defer db.Close()
	// // numStrings := 5 // Nombre de chaînes à générer
	// // titles := []string{"", "Ukraine War",
	// // 	"Rising Inflation: Impact on Consumer Purchasing Power",
	// // 	"Distance Learning: Challenges and Benefits of Online Learning",
	// // 	"Football World Cup: Highlights from the Grand Finale",
	// // 	"Modern Art Exhibition: Exploring New Trends and Styles"}
	// //  content := "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt, modi quas. Architecto soluta omnis asperiores rem qui sed debitis aperiam. Iusto odio autem sint hic libero molestias, maxime inventore neque?"
	// like := "true"
	// dislike := "true"
	// for i := 1; i < 6; i++ {
	// 	if i%2 == 0 {
	// 		like, dislike = "false", "true"
	// 	} else {
	// 		like, dislike = "true", "false"
	// 	}
	// 	date := randomInt(2) + "/" + randomInt(2) + "/" + randomInt(2)

	// 	Pos_id, Use_id := i, randmId(1)
	// 	// title := titles[i]
	// 	// image := ""
	// 	// _, err := db.Exec("INSERT INTO Category (name) VALUES (?)", el)
	// 	// if err != nil {
	// 	// 	panic(err)
	// 	// }
	// 	// randomStr := randomString(1) // Génère une chaîne de 10 caractères aléatoires
	// 	_, err := db.Exec("INSERT INTO Appreciation (Use_id, Pos_id, like, dislike, date) VALUES (?, ?, ?, ?, ?)", Use_id, Pos_id, like, dislike, date)
	// 	if err != nil {
	// 		panic(err)
	// 	}
	// 	// date := "25/07/09"
	// 	// id := 2
	// 	// _, err = db.Exec("UPDATE Post SET date = ? WHERE id = ?", date, id)
	// 	// if err != nil {
	// 	// 	panic(err)
	// 	// }
	// }
}
