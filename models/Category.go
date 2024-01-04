package models

import (
	"database/sql"
)

type Categorys struct {
	ID     int
	Name   string
	PostId int
}

type Category struct {
	ID   int
	Name string
}
type CatPost struct {
	PostCat []Categorys
	Cat     []Category
}

func (Cat *Category) GetCategory(db *sql.DB) (CatPost, error) {
	req := `SELECT * from Category;`
	row, err := db.Query(req)
	CatPost := CatPost{}

	if err != nil {
		return CatPost, err
	}
	for row.Next() {
		row.Scan(&Cat.ID, &Cat.Name)
		CatPost.Cat = append(CatPost.Cat, *Cat)
	}
	catp := Categorys{}
	CatPost.PostCat, err = catp.GetCategoryp(db)
	if err != nil {
		return CatPost, err
	}
	return CatPost, row.Err()
}

func (Cat *Categorys) GetCategoryp(db *sql.DB) ([]Categorys, error) {
	req := `SELECT c.id,c.name,pt."Pos_id" from Category c LEFT JOIN "Post_Category" pt WHERE pt."Cat_id"=c.id;`
	row, err := db.Query(req)
	cattte := []Categorys{}
	if err != nil {
		return cattte, err
	}
	for row.Next() {
		row.Scan(&Cat.ID, &Cat.Name, &Cat.PostId)
		cattte = append(cattte, *Cat)
	}
	return cattte, row.Err()
}

func (Cat *Category) Post_id(db *sql.DB, cat_id int) ([]int, error) {
	req := `SELECT Pos_id FROM "Post_Category" WHERE "Cat_id"=?`
	row, err := db.Query(req, cat_id)
	Posts_id := []int{}
	if err != nil {
		return Posts_id, err
	}
	for row.Next() {
		var post_idd int
		row.Scan(&post_idd)
		Posts_id = append(Posts_id, post_idd)
	}
	return Posts_id, row.Err()
}
