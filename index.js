import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Books",
  password: "1qaz2wSx3edc",
  port: 5432,
});

db.connect();

app.get("/", async (req, res) => {
  const sort = req.query.sort;

  let query = "SELECT * FROM books";

  if (sort === "rating") {
    query = "SELECT * FROM books ORDER BY rating DESC";
  } else if (sort === "title") {
    query = "SELECT * FROM books ORDER BY title ASC";
  } else if (sort === "date") {
    query = "SELECT * FROM books ORDER BY add_date DESC";
  }

  const result = await db.query(query);

  for (const book of result.rows) {
    try {
      const response = await axios.get(
        `https://openlibrary.org/isbn/${book.isbn}.json`
      );

      console.log(response.data);
    } catch (error) {
      console.log(`Could not find ISBN: ${book.isbn}`);
    }
  }

  res.render("index.ejs", { data: result.rows });
});

app.get("/edit/:id", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM books WHERE id = $1",
    [req.params.id]
  );

  res.render("edit.ejs", { data: result.rows[0] });
});

app.get("/delete/:id", async (req, res) => {
  await db.query(
    "DELETE FROM books WHERE id = $1",
    [req.params.id]
  );

  res.redirect("/");
});

app.post("/add-book", async (req, res) => {
  await db.query(
    "INSERT INTO books (title, notes, rating, isbn) VALUES ($1, $2, $3, $4)",
    [
      req.body.title,
      req.body.notes,
      req.body.rating,
      req.body.isbn
    ]
  );

  res.redirect("/");
});

app.post("/edit-book", async (req, res) => {
  await db.query(
    "UPDATE books SET title = $1, notes = $2, rating = $3, isbn = $4 WHERE id = $5",
    [
      req.body.title,
      req.body.notes,
      req.body.rating,
      req.body.isbn,
      req.body.id
    ]
  );

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`great you have successfully connected to port ${port}`);
});