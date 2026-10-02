
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import session from "express-session";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "book-note-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// PostgreSQL
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Books",
  password: "***********",
  port: 5432,
});

db.connect();

// =========================
// HOME
// =========================

app.get("/", async (req, res) => {

  // If the user is NOT logged in,
  // show only the welcome page.
  if (!req.session.userId) {
    return res.render("index.ejs", {
      data: [],
      userId: null,
    });
  }

  const sort = req.query.sort;

  let query = `
    SELECT * FROM books
    WHERE user_id = $1
  `;

  const values = [req.session.userId];

  if (sort === "rating") {
    query = `
      SELECT * FROM books
      WHERE user_id = $1
      ORDER BY rating DESC
    `;
  } else if (sort === "title") {
    query = `
      SELECT * FROM books
      WHERE user_id = $1
      ORDER BY title ASC
    `;
  } else if (sort === "date") {
    query = `
      SELECT * FROM books
      WHERE user_id = $1
      ORDER BY add_date DESC
    `;
  }

  const result = await db.query(query, values);

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

  res.render("index.ejs", {
    data: result.rows,
    userId: req.session.userId,
  });
});

// =========================
// REGISTER PAGE
// =========================

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// =========================
// LOGIN PAGE
// =========================

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// =========================
// REGISTER
// =========================

app.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email, hashedPassword]
  );

  res.redirect("/login");
});

// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.send("User not found");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.send("Incorrect password");
  }

  req.session.userId = user.id;

  res.redirect("/");
});

// =========================
// EDIT PAGE
// =========================

app.get("/edit/:id", async (req, res) => {

  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const result = await db.query(
    "SELECT * FROM books WHERE id = $1 AND user_id = $2",
    [req.params.id, req.session.userId]
  );

  if (result.rows.length === 0) {
    return res.send("Book not found");
  }

  res.render("edit.ejs", {
    data: result.rows[0],
  });
});

// =========================
// DELETE BOOK
// =========================

app.get("/delete/:id", async (req, res) => {

  if (!req.session.userId) {
    return res.redirect("/login");
  }

  await db.query(
    "DELETE FROM books WHERE id = $1 AND user_id = $2",
    [req.params.id, req.session.userId]
  );

  res.redirect("/");
});

// =========================
// ADD BOOK
// =========================

app.post("/add-book", async (req, res) => {

  if (!req.session.userId) {
    return res.redirect("/login");
  }

  await db.query(
    `INSERT INTO books
    (title, notes, rating, isbn, user_id)
    VALUES ($1, $2, $3, $4, $5)`,
    [
      req.body.title,
      req.body.notes,
      req.body.rating,
      req.body.isbn,
      req.session.userId,
    ]
  );

  res.redirect("/");
});

// =========================
// EDIT BOOK
// =========================

app.post("/edit-book", async (req, res) => {

  if (!req.session.userId) {
    return res.redirect("/login");
  }

  await db.query(
    `UPDATE books
     SET title = $1,
         notes = $2,
         rating = $3,
         isbn = $4
     WHERE id = $5
     AND user_id = $6`,
    [
      req.body.title,
      req.body.notes,
      req.body.rating,
      req.body.isbn,
      req.body.id,
      req.session.userId,
    ]
  );

  res.redirect("/");
});

// =========================
// LOGOUT
// =========================

app.get("/logout", (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      return res.send("Could not log out");
    }

    res.redirect("/");
  });
});

// =========================
// START SERVER
// =========================

app.listen(port, () => {
  console.log(`great you have successfully connected to port ${port}`);
});
