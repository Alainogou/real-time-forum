package models

import (
	"database/sql"
)

type Category struct {
	Name []string
}

func (Cat *Category) GetCategory(db *sql.DB, post_id int) error {
	req := `SELECT c.categoryName  from category c LEFT JOIN "category_relation" pt WHERE pt."categoryId"=c.id AND pt."postId"=?;`
	row, err := db.Query(req, post_id)

	if err != nil {
		return err
	}

	for row.Next() {
		var name string
		row.Scan(&name)
		Cat.Name = append(Cat.Name, name)

	}
	return row.Err()
}

// type CatPost struct {
// 	PostCat []Categorys
// 	Cat     []Category
// }

// func (Cat *Category) GetCategory(db *sql.DB) (CatPost, error) {
// 	req := `SELECT * from Category;`
// 	row, err := db.Query(req)
// 	CatPost := CatPost{}

// 	if err != nil {
// 		return CatPost, err
// 	}
// 	for row.Next() {
// 		row.Scan(&Cat.ID, &Cat.Name)
// 		CatPost.Cat = append(CatPost.Cat, *Cat)
// 	}
// 	catp := Categorys{}
// 	CatPost.PostCat, err = catp.GetCategoryp(db)
// 	if err != nil {
// 		return CatPost, err
// 	}
// 	return CatPost, row.Err()
// }

// func (Cat *Category) Post_id(db *sql.DB, cat_id int) ([]int, error) {
// 	req := `SELECT Pos_id FROM "Post_Category" WHERE "Cat_id"=?`
// 	row, err := db.Query(req, cat_id)
// 	Posts_id := []int{}
// 	if err != nil {
// 		return Posts_id, err
// 	}
// 	for row.Next() {
// 		var post_idd int
// 		row.Scan(&post_idd)
// 		Posts_id = append(Posts_id, post_idd)
// 	}
// 	return Posts_id, row.Err()
// }
