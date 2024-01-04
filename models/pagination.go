package models
import (
	"database/sql"
	"math"
)
var ActualPage int
type Pagination struct {
	Page, PageSize int
}
type Metadata struct {
	CurrentPage, PageSize, FirstPage, LastPage, TotalRecords int
}
func (m Metadata) Iterate(n int) []int {
	var pages []int
	for i := 1; i <= n; i++ {
		pages = append(pages, i)
	}
	return pages
}
func (p Pagination) Limit() int {
	return p.PageSize
}
func (p Pagination) Offset() int {
	return (p.Page - 1) * p.PageSize
}
// func GetTotalRecordsV1(user User, db *sql.DB, parameter string) (int, error) {
// 	var totalRecords int
// 	var req string
// 	id := strconv.Itoa(user.Id)
// 	if parameter == id {
// 		req = `SELECT COUNT(*) FROM "Appreciation" WHERE  like=1 AND "Use_id"=?`
// 	} else {
// 		req = `SELECT COUNT(*) FROM Post`
// 	}
// 	rows, err := db.Query(req, user.Id)
// 	if err != nil {
// 		return totalRecords, err
// 	}
// 	for rows.Next() {
// 		err = rows.Scan(&totalRecords)
// 		if err != nil {
// 			return totalRecords, err
// 		}
// 	}
// 	return totalRecords, rows.Err()
// }
func GetTotalRecords(query string, user User, db *sql.DB) (int, error) {
	var totalRecords int
	rows, err := db.Query(query, user.Id)
	if err != nil {
		return totalRecords, err
	}
	for rows.Next() {
		err = rows.Scan(&totalRecords)
		if err != nil {
			return totalRecords, err
		}
	}
	
	return totalRecords, rows.Err()
}
func GetMetadata(totalRecords, page, pageSize int) Metadata {
	if totalRecords == 0 {
		return Metadata{}
	}
	return Metadata{
		CurrentPage: page,
		PageSize:    pageSize,
		FirstPage:   1,
		LastPage:    int(math.Ceil(float64(totalRecords) / float64(pageSize))),
	}
}