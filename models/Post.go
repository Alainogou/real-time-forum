package models

import (
	"database/sql"
	"fmt"
)

type Post struct {
	ID        int
	User_id   int
	Title     string
	Content   string
	ImageName string
	Category  []int
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
	Post_id     int      `json:"Post_id"`
	Title       string   `json:"Title"`
	Content     string   `json:"Content"`
	ImageName   string   `json:"ImageName"`
	NickName    string   `json:"NickName"`
	User_id     int      `json:"User_id"`
	Nbrlike     int      `json:"Nbrlike"`
	NbrComments int      `json:"NbrComments"`
	Category    []string `json:"Category"`
}

func (post *Post) GetAllPosts(db *sql.DB) ([]AllPost, error) {
	Allpost := []AllPost{}
	var err error
	var row *sql.Rows

	req := `SELECT p.id, p.title, p.content, p.imgUrl, u.nickName, u.id,
					( SELECT count(*) FROM "user_post_reaction" "a" WHERE p.id=a."postId" AND isLiked) as "liked",
					( SELECT count(*) FROM "comment" "c" WHERE p.id=c."postId" ) as "Comments"
				FROM "Post" "p"
				JOIN "User" "u" ON p.userId = u.id ORDER BY p.id DESC;
				`
	row, err = db.Query(req)

	if err != nil {
		fmt.Println("eer", err)
		return []AllPost{}, err
	}

	for row.Next() {

		OnePosts := AllPost{}

		row.Scan(&OnePosts.Post_id, &OnePosts.Title, &OnePosts.Content, &OnePosts.ImageName, &OnePosts.NickName, &OnePosts.User_id, &OnePosts.Nbrlike, &OnePosts.NbrComments)
		category := Category{}
		err = category.GetCategory(db, OnePosts.Post_id)
		if err != nil {
			fmt.Println("err lors avec GetCAt")
		}
		OnePosts.Category = category.Name
		Allpost = append(Allpost, OnePosts)
	}
	return Allpost, row.Err()
}

func (post *Post) InsertPost(db *sql.DB) error {
	req := `INSERT INTO post ( userId,title,content, imgUrl) VALUES (?,?,?,?)`
	data, err := db.Exec(req, post.User_id, post.Title, post.Content, post.ImageName)
	if err != nil {
		fmt.Println(err)
		return err
	}

	i, errres := data.LastInsertId()
	if errres != nil {
		fmt.Println(errres)
		return errres
	}
	for _, v := range post.Category {
		req2 := `INSERT INTO  category_relation ( postId, categoryId) VALUES (?,?);`
		_, errree := db.Exec(req2, i, v)
		if errree != nil {
			fmt.Println("errrese")
			return errree
		}
	}
	return nil

}

// func (post *Post) GetOnPostComment(db *sql.DB, id int) (AllPost, error) {
// 	Allpost := AllPost{}
// 	req := `SELECT p.id,p.title,p.content,p.image,p."date",u.username,
// 	( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND a.like=1) as "likes",
// 	( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND a.dislike=1) as "dislikes"
// 	 FROM "Post" "p" inner JOIN "User" "u" ON p."Use_id"=u.id WHERE p.id=? ORDER BY p.id DESC`
// 	row, err := db.Query(req, id)
// 	if err != nil {
// 		fmt.Println(err)
// 		return Allpost, err
// 	}

// 	user := User{}
// 	OnePosts := AllPost{Poster: user, OnePost: *post}
// 	for row.Next() {
// 		row.Scan(&OnePosts.OnePost.ID, &OnePosts.OnePost.Title, &OnePosts.OnePost.Content, &OnePosts.OnePost.Image, &OnePosts.OnePost.Date, &OnePosts.Poster.NickName, &OnePosts.Nbrlike, &OnePosts.NbrDislike)
// 		formate := time.Now().Sub(OnePosts.OnePost.Date.Local())
// 		OnePosts.OnePost.Date = time.Date(0, 0, 0, int(formate.Hours()), int(formate.Minutes()), int(formate.Seconds()), int(formate.Milliseconds()), time.UTC)
// 	}

// 	return OnePosts, row.Err()
// }

// func (user *User) GetUserPosts(db *sql.DB, pagination Pagination, cat_id string) ([]AllPost, error) {
// 	Allpost := []AllPost{}
// 	var err error
// 	var row *sql.Rows
// 	Cat_idd, errconv := strconv.Atoi(cat_id)
// 	if cat_id != "" && errconv == nil {

// 		req := `SELECT p.id, p.title,p.content,p.image,p."date",u.username,
// 		(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
// 		(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
// 		(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
// 				FROM "Post" "p"
// 				JOIN "User" "u" ON p.Use_id=u.id
// 				LEFT JOIN "Post_Category" pt on  pt."Pos_id"=p.id
// 				WHERE u.id =?  and pt."Cat_id"=? ORDER BY p.id DESC LIMIT $1 OFFSET $2`
// 		row, err = db.Query(req, user.Id, Cat_idd, pagination.Limit(), pagination.Offset())
// 	} else {
// 		req := `SELECT p.id, p.title,p.content,p.image,p."date",u.username,
// 			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
// 			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
// 			(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
// 		FROM "Post" "p"
// 		JOIN "User" "u" ON p.Use_id=u.id
// 		WHERE u.id = ? ORDER BY p.id DESC LIMIT $1 OFFSET $2
// 		`
// 		row, err = db.Query(req, user.Id, pagination.Limit(), pagination.Offset())
// 	}

// 	if err != nil {
// 		return []AllPost{}, err
// 	}
// 	for row.Next() {
// 		user := User{}
// 		OnePosts := AllPost{Poster: user, OnePost: Post{}}
// 		row.Scan(&OnePosts.OnePost.ID, &OnePosts.OnePost.Title, &OnePosts.OnePost.Content, &OnePosts.OnePost.Image, &OnePosts.OnePost.Date, &OnePosts.Poster.NickName, &OnePosts.Nbrlike, &OnePosts.NbrDislike, &OnePosts.NbrComments)
// 		Allpost = append(Allpost, OnePosts)
// 	}
// 	return Allpost, row.Err()
// }

// func (user *User) GetLikedPosts(db *sql.DB, pagination Pagination, cat_id string) ([]AllPost, error) {
// 	Allpost := []AllPost{}
// 	var err error
// 	var row *sql.Rows
// 	Cat_idd, errconv := strconv.Atoi(cat_id)
// 	if cat_id != "" && errconv == nil {
// 		req := `SELECT p.id, p.title,p.content,p.image,p."date", u.username,
// 			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
// 			(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
// 			(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
// 		FROM "Post" "p"
// 		JOIN "Appreciation" "a" ON p.id=a.Pos_id
// 		LEFT JOIN "Post_Category" pt on  pt."Pos_id"=p.id
// 		JOIN "User" "u" ON p.Use_id = u.id
// 		WHERE a.Use_id = ? AND a.like = 1 AND pt."Cat_id"=?  ORDER BY p.id DESC LIMIT $1 OFFSET $2;
// 		`

// 		row, err = db.Query(req, user.Id, Cat_idd, pagination.Limit(), pagination.Offset())
// 	} else {
// 		req := `SELECT p.id, p.title,p.content,p.image,p."date", u.username,
// 					(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
// 					(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
// 					(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
// 				FROM "Post" "p"
// 				JOIN "Appreciation" "a" ON p.id=a.Pos_id
// 				JOIN "User" "u" ON p.Use_id = u.id
// 				WHERE a.Use_id = ? AND a.like = 1 LIMIT $1 OFFSET $2;
// 				`
// 		row, err = db.Query(req, user.Id, pagination.Limit(), pagination.Offset())
// 	}
// 	if err != nil {
// 		return []AllPost{}, err
// 	}
// 	for row.Next() {
// 		user := User{}
// 		OnePosts := AllPost{Poster: user, OnePost: Post{}}
// 		row.Scan(&OnePosts.OnePost.ID, &OnePosts.OnePost.Title, &OnePosts.OnePost.Content, &OnePosts.OnePost.Image, &OnePosts.OnePost.Date, &OnePosts.Poster.NickName, &OnePosts.Nbrlike, &OnePosts.NbrDislike, &OnePosts.NbrComments)
// 		Allpost = append(Allpost, OnePosts)
// 	}
// 	return Allpost, row.Err()
// }

// func List_posts_id(db *sql.DB, cat_id string) []int {
// 	caId, err := strconv.Atoi(cat_id)
// 	if err != nil {
// 		return []int{}
// 	}
// 	categorie := Category{}
// 	ListPost_id, errPost := categorie.Post_id(db, caId)
// 	if errPost != nil {
// 		return []int{}
// 	}
// 	return ListPost_id
// }
