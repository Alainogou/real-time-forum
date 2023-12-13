
/*==============================================================*/
/* Table : Appreciation                                         */
/*==============================================================*/
create table Appreciation 
(
   id                   integer                        not null,
   Use_id               integer                        not null,
   Pos_id               integer                        ,
   Com_id               integer,
   "like"               smallint                       null,
   dislike              smallint                       null,
   "date"               timestamp                      null,
   constraint PK_APPRECIATION primary key (id)
);

/*==============================================================*/
/* Index : APPRECIATION_PK                                      */
/*==============================================================*/
create unique index APPRECIATION_PK on Appreciation (
id ASC
);

/*==============================================================*/
/* Index : ASSOCIATION2_FK                                      */
/*==============================================================*/
create index ASSOCIATION2_FK on Appreciation (
Use_id ASC
);

/*==============================================================*/
/* Index : ASSOCIATION6_FK                                      */
/*==============================================================*/
create index ASSOCIATION6_FK on Appreciation (
Pos_id ASC
);

/*==============================================================*/
/* Index : ASSOCIATION6_FK                                      */
/*==============================================================*/
create index ASSOCIATION7_FK on Appreciation (
Com_id ASC
);

/*==============================================================*/
/* Table : Category                                             */
/*==============================================================*/
create table Category 
(
   id                   integer                        not null,
   name                 varchar(254)                   null,
   constraint PK_CATEGORY primary key (id)
);

/*==============================================================*/
/* Index : CATEGORY_PK                                          */
/*==============================================================*/
create unique index CATEGORY_PK on Category (
id ASC
);

/*==============================================================*/
/* Table :Post-Category                                             */
/*==============================================================*/
create table Post_Category  
(
   id                   integer                        not null,
   Cat_id               integer                        not null,
   Pos_id               integer                        not null,
   constraint PK_POST_CATEGORY primary key (id)
);

/*==============================================================*/
/* Index : Post-Category                                           */
/*==============================================================*/
create unique index POST_CATEGORY_PK on Post_Category (
   id ASC
);
/*==============================================================*/
/* Index : ASSOCIATION3_FK                                      */
/*==============================================================*/
create index ASSOCIATION10_FK on "Post_Category" (
Cat_id  ASC
);
/*==============================================================*/
/* Index : ASSOCIATION3_FK                                      */
/*==============================================================*/
create index ASSOCIATION12_FK on "Post_Category" (
   Pos_id  ASC
);

/*==============================================================*/
/* Table : "Comment"                                            */
/*==============================================================*/
create table "Comment" 
(
   id                   integer                        not null,
   Pos_id               integer                        not null,
   Use_id               integer                        not null,
   content              varchar(254)                   null,
   "date"               timestamp                      null,
   constraint PK_COMMENT primary key (id)
);

/*==============================================================*/
/* Index : COMMENT_PK                                           */
/*==============================================================*/
create unique index COMMENT_PK on "Comment" (
id ASC
);

/*==============================================================*/
/* Index : ASSOCIATION3_FK                                      */
/*==============================================================*/
create index ASSOCIATION3_FK on "Comment" (
Use_id ASC
);

/*==============================================================*/
/* Index : ASSOCIATION4_FK                                      */
/*==============================================================*/
create index ASSOCIATION4_FK on "Comment" (
Pos_id ASC
);

/*==============================================================*/
/* Table : Post                                                 */
/*==============================================================*/
create table Post 
(
   id                   integer                        not null,
   Use_id               integer                        not null,
   title                varchar(254)                   null,
   content              varchar(254)                   null,
   image                varchar(254)                   null,
   "date"               timestamp                      null,
   constraint PK_POST primary key (id)
);

/*==============================================================*/
/* Index : POST_PK                                              */
/*==============================================================*/
create unique index POST_PK on Post (
id ASC
);

/*==============================================================*/
/* Index : ASSOCIATION1_FK                                      */
/*==============================================================*/
create index ASSOCIATION1_FK on Post (
Use_id ASC
);

/*==============================================================*/
/* Table : "User"                                               */
/*==============================================================*/
create table "User" 
(
   id                   integer                        not null,
   nickName             varchar(254)                   null,
   email                varchar(254)        UNIQUE NOT NULL,
   lastName             varchar(254)                   null,
   firstName             varchar(254)                   null,
   password             varchar(254)                   null,
   age                  int(254)                       null,
   gender               varchar(254)                   null,
   constraint PK_USER primary key (id)
);

CREATE TABLE IF NOT EXISTS Session (
   id                   integer  not null,
	sessionId varchar(250) ,
	email		varchar(250),
	datefin		TIMESTAMP,
    constraint PK_SESS primary key (id)
);
create unique index SESS_PK on "Session" (
id ASC
);
/*==============================================================*/
/* Index : USER_PK                                              */
/*==============================================================*/
create unique index USER_PK on "User" (
id ASC
);

INSERT INTO Category (name) VALUES ('Sport'), ('Art'), ('Informatics'), ('Biology'), ('Litterature');