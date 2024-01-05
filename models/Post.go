package models

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

type Post struct {
	ID          int       `json:"ID"`
	User_id     int       `json:"User_id"`
	Category_id int       `json:"Category_id"`
	Title       string    `json:"Title"`
	Content     string    `json:"Content"`
	Image       string    `json:"Image"`
	Cat         []string  `json:"Cat"`
	Date        time.Time `json:"Date"`
}
type UserData struct {
	Datas  interface{}
	IsAuth bool
	Cats   []Category
	// Pagin      models.Metadata
	User       User
	Comments   []Comment
	ErrorLog   string
	CurrentCat int
}

type AllPost struct {
	OnePost     Post
	Poster      User
	Nbrlike     int
	NbrDislike  int
	NbrComments int
}

func (post *Post) GetAllPosts(db *sql.DB, pagination Pagination, cat_id string) ([]AllPost, error) {
	Allpost := []AllPost{}
	var err error
	var row *sql.Rows
	Cat_idd, errconv := strconv.Atoi(cat_id)
	if cat_id != "" && errconv == nil {

		req := `SELECT p.id, p.title,p.content,p.image,p."date", u.username,
		( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
		( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
		( SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
		FROM "Post" p
		LEFT JOIN "Post_Category" pt on  pt."Pos_id"=p.id
		JOIN "User" "u" ON p.Use_id = u.id  where pt."Cat_id"=? ORDER BY p.id DESC LIMIT $1 OFFSET $2`

		row, err = db.Query(req, Cat_idd, pagination.Limit(), pagination.Offset())
	} else {
		req := `SELECT p.id, p.title,p.content,p.image, p."date", u.username,
					( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
					( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
					( SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
				FROM "Post" "p"
				JOIN "User" "u" ON p.Use_id = u.id ORDER BY p.id DESC LIMIT $1 OFFSET $2;
				`
		row, err = db.Query(req, pagination.Limit(), pagination.Offset())
	}

	if err != nil {
		fmt.Println(err)
		return []AllPost{}, err
	}
	for row.Next() {
		user := User{}
		OnePosts := AllPost{Poster: user, OnePost: *post}
		row.Scan(&OnePosts.OnePost.ID, &OnePosts.OnePost.Title, &OnePosts.OnePost.Content, &OnePosts.OnePost.Image, &OnePosts.OnePost.Date, &OnePosts.Poster.NickName, &OnePosts.Nbrlike, &OnePosts.NbrDislike, &OnePosts.NbrComments)
		Allpost = append(Allpost, OnePosts)
	}
	return Allpost, row.Err()
}

func (post *Post) InsertPost(db *sql.DB, title, content, imagename string, user_id int, cat_id []int) error {
	req := `INSERT INTO Post (Use_id,title,content,image,date) VALUES (?,?,?,?,?)`
	data, err := db.Exec(req, user_id, title, content, imagename, time.Now())
	if err != nil {
		fmt.Println(err)
		return err
	}
	i, errres := data.LastInsertId()
	if errres != nil {

		fmt.Println(errres)
		return errres
	}
	for _, v := range cat_id {
		req2 := `INSERT INTO  Post_Category ( Pos_id, Cat_id) VALUES (?,?);`
		_, errree := db.Exec(req2, i, v)
		if errree != nil {
			fmt.Println(errree)
			return errree
		}
	}
	return nil

}

func (post *Post) GetOnPostComment(db *sql.DB, id int) (AllPost, error) {
	Allpost := AllPost{}
	req := `SELECT p.id,p.title,p.content,p.image,p."date",u.username, 
	( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND a.like=1) as "likes",
	( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND a.dislike=1) as "dislikes"
	 FROM "Post" "p" inner JOIN "User" "u" ON p."Use_id"=u.id WHERE p.id=? ORDER BY p.id DESC`
	row, err := db.Query(req, id)
	if err != nil {
		fmt.Println(err)
		return Allpost, err
	}

	user := User{}
	OnePosts := AllPost{Poster: user, OnePost: *post}
	for row.Next() {
		row.Scan(&OnePosts.OnePost.ID, &OnePosts.OnePost.Title, &OnePosts.OnePost.Content, &OnePosts.OnePost.Image, &OnePosts.OnePost.Date, &OnePosts.Poster.NickName, &OnePosts.Nbrlike, &OnePosts.NbrDislike)
		formate := time.Now().Sub(OnePosts.OnePost.Date.Local())
		OnePosts.OnePost.Date = time.Date(0, 0, 0, int(formate.Hours()), int(formate.Minutes()), int(formate.Seconds()), int(formate.Milliseconds()), time.UTC)
	}

	return OnePosts, row.Err()
}

func (user *User) GetUserPosts(db *sql.DB, pagination Pagination, cat_id string) ([]AllPost, error) {
	Allpost := []AllPost{}
	var err error
	var row *sql.Rows
	Cat_idd, errconv := strconv.Atoi(cat_id)
	if cat_id != "" && errconv == nil {

		req := `SELECT p.id, p.title,p.content,p.image,p."date",u.username, 
		(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
		(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
		(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
				FROM "Post" "p"
				JOIN "User" "u" ON p.Use_id=u.id
				LEFT JOIN "Post_Category" pt on  pt."Pos_id"=p.id
				WHERE u.id =?  and pt."Cat_id"=? ORDER BY p.id DESC LIMIT $1 OFFSET $2`
		row, err = db.Query(req, user.Id, Cat_idd, pagination.Limit(), pagination.Offset())
	} else {
		req := `SELECT p.id, p.title,p.content,p.image,p."date",u.username, 
			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
			(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
		FROM "Post" "p"
		JOIN "User" "u" ON p.Use_id=u.id
		WHERE u.id = ? ORDER BY p.id DESC LIMIT $1 OFFSET $2
		`
		row, err = db.Query(req, user.Id, pagination.Limit(), pagination.Offset())
	}

	if err != nil {
		return []AllPost{}, err
	}
	for row.Next() {
		user := User{}
		OnePosts := AllPost{Poster: user, OnePost: Post{}}
		row.Scan(&OnePosts.OnePost.ID, &OnePosts.OnePost.Title, &OnePosts.OnePost.Content, &OnePosts.OnePost.Image, &OnePosts.OnePost.Date, &OnePosts.Poster.NickName, &OnePosts.Nbrlike, &OnePosts.NbrDislike, &OnePosts.NbrComments)
		Allpost = append(Allpost, OnePosts)
	}
	return Allpost, row.Err()
}

func (user *User) GetLikedPosts(db *sql.DB, pagination Pagination, cat_id string) ([]AllPost, error) {
	Allpost := []AllPost{}
	var err error
	var row *sql.Rows
	Cat_idd, errconv := strconv.Atoi(cat_id)
	if cat_id != "" && errconv == nil {
		req := `SELECT p.id, p.title,p.content,p.image,p."date", u.username,
			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
			(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
		FROM "Post" "p"
		JOIN "Appreciation" "a" ON p.id=a.Pos_id
		LEFT JOIN "Post_Category" pt on  pt."Pos_id"=p.id
		JOIN "User" "u" ON p.Use_id = u.id
		WHERE a.Use_id = ? AND a.like = 1 AND pt."Cat_id"=?  ORDER BY p.id DESC LIMIT $1 OFFSET $2;
		`

		row, err = db.Query(req, user.Id, Cat_idd, pagination.Limit(), pagination.Offset())
	} else {
		req := `SELECT p.id, p.title,p.content,p.image,p."date", u.username,
					(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
					(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
					(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
				FROM "Post" "p"
				JOIN "Appreciation" "a" ON p.id=a.Pos_id
				JOIN "User" "u" ON p.Use_id = u.id
				WHERE a.Use_id = ? AND a.like = 1 LIMIT $1 OFFSET $2;
				`
		row, err = db.Query(req, user.Id, pagination.Limit(), pagination.Offset())
	}
	if err != nil {
		return []AllPost{}, err
	}
	for row.Next() {
		user := User{}
		OnePosts := AllPost{Poster: user, OnePost: Post{}}
		row.Scan(&OnePosts.OnePost.ID, &OnePosts.OnePost.Title, &OnePosts.OnePost.Content, &OnePosts.OnePost.Image, &OnePosts.OnePost.Date, &OnePosts.Poster.NickName, &OnePosts.Nbrlike, &OnePosts.NbrDislike, &OnePosts.NbrComments)
		Allpost = append(Allpost, OnePosts)
	}
	return Allpost, row.Err()
}

func List_posts_id(db *sql.DB, cat_id string) []int {
	caId, err := strconv.Atoi(cat_id)
	if err != nil {
		return []int{}
	}
	categorie := Category{}
	ListPost_id, errPost := categorie.Post_id(db, caId)
	if errPost != nil {
		return []int{}
	}
	return ListPost_id
}
