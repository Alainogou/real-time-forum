package models

import (
	"database/sql"
	"time"
)

type MessagePrivate struct {
	ID       int
	FromUser       string 
	ContentMessage string 
	ToUser         string 
	CreateDate     time.Time
}

func (Com *Comment) GetMessage(db *sql.DB, post_id int) ([]Comment, error) {

	req := `SELECT c.id,c.content,u.Nickname
	FROM "Comment" c 
	INNER JOIN "User" u on c."userId"=u.id  WHERE c."postId"=?
	ORDER BY c."created_at" DESC;`

	comments := []Comment{}

	row, err := db.Query(req, post_id)
	if err != nil {
		return comments, err
	}
	for row.Next() {

		comment := Comment{}
		row.Scan(&comment.ID, &comment.Content, &comment.NickName)
		comments = append(comments, comment)
	}
	return comments, row.Err()
}

func (Com *MessagePrivate) InsertMessage(db *sql.DB, fromUser, toUser , contentMessage string) error {
	req := `INSERT INTO message (fromUser,toUser,message,isRead,createdDate) VALUES(?,?,?,?,?);`
	_, errr := db.Exec(req, fromUser, toUser, contentMessage, 0,time.Now())
	return errr
}
