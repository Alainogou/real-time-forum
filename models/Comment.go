package models

import (
	"database/sql"
	"time"
)

type Comment struct {
	ID       int
	Content  string
	User_id  int
	Post_id  int
	Date     time.Time
	Username string
	Like     int
	Dislike  int
}

func (Com *Comment) GetComments(db *sql.DB, post_id int) ([]Comment, error) {

	req := `SELECT c.id,c.content,u.username,(SELECT count(id)  FROM "Appreciation" a  WHERE a."Com_id"=c.id AND like =1 ) as like,
	(SELECT count(id)  FROM "Appreciation" a  WHERE a."Com_id"=c.id AND dislike =1 ) as dislike
	FROM "Comment" c 
	INNER JOIN "User" u on c."Use_id"=u.id  WHERE c."Pos_id"=?;`
	comments := []Comment{}

	row, err := db.Query(req, post_id)
	if err != nil {
		return comments, err
	}
	for row.Next() {

		comment := Comment{}
		row.Scan(&comment.ID, &comment.Content, &comment.Username, &comment.Like, &comment.Dislike)
		formate := time.Now().Sub(comment.Date.Local())
		comment.Date = time.Date(0, 0, 0, int(formate.Hours()), int(formate.Minutes()), int(formate.Seconds()), int(formate.Milliseconds()), time.UTC)
		comments = append(comments, comment)
	}
	return comments, row.Err()
}

func (Com *Comment) InsertComments(db *sql.DB, post_id, user_id int, content string) error {
	req := `INSERT INTO Comment (Use_id,Pos_id,content) VALUES(?,?,?);`
	_, errr := db.Exec(req, user_id, post_id, content)
	return errr
}
