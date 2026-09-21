# Book Note

**Created by Yohannes Daniel Alemayehu**

Hello everyone! I hope you're all doing well.

I was motivated to build this website because I noticed that many people struggle to remember the books they have read. I have a friend who reads a lot of books, and whenever I ask him about a book he has read, he often says, “I’ll tell you after I read some parts again.”

So, I thought, why not build a website where you can keep notes about the books you read, rate them, and easily come back to them later?

I hope my website can help solve this problem. Thanks for checking out my project!

## Features

- Add a book
- Write the book title
- Give the book a rating
- Write notes about the main idea you would like to remember
- Add an ISBN to get the book cover and information
- Edit a book
- Delete a book
- Sort books by rating, title, or date
- Store all books in PostgreSQL

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- EJS
- Axios
- Open Library Covers API
- HTML
- CSS

## How to Run

1. Clone the repository.
2. Open the project folder in your code editor.
3. Install the required packages by running:
   `npm install`
4. Make sure PostgreSQL is installed and running.
5. Create a PostgreSQL database and a `books` table.
6. Update the database connection in `index.js` with your own PostgreSQL username, database name, and password.
7. Start the server by running:
   `node index.js`
8. Open `http://localhost:3000` in your browser.

## Database Setup

```sql
CREATE TABLE books (
 id SERIAL PRIMARY KEY,
  title TEXT,
  notes TEXT,
  rating NUMERIC(2,1),
  add_date DATE DEFAULT CURRENT_DATE,
  isbn TEXT
);
```

## Project Structure

```text
book-note/
├── public/
│   └── style.css
├── views/
│   ├── index.ejs
│   └── edit.ejs
├── index.js
├── package.json
└── README.md
```

- `public/style.css` — Contains the CSS used to style the website and make it responsive.
- `views/index.ejs` — The main page that displays the books and the forms.
- `views/edit.ejs` — The page used to edit an existing book.
- `index.js` — The main server file. It contains the Express routes, PostgreSQL queries, and API requests.
- `package.json` — Contains information about the project and the packages used.
- `README.md` — Contains information and instructions about the project.

## What I Learned

- How Node.js and PostgreSQL can be connected to store data from the server in the database.
- How CRUD (Create, Read, Update, and Delete) works. As you can see in this project, it contains all of these operations.
- How to create Express routes for different actions in the application.
- How to use SQL queries to add, read, update, delete, and sort data.
 -How to use EJS to display data from PostgreSQL on a webpage.
- How to use Axios to communicate with a public API.
-How to use an ISBN to get book covers from the Open Library Covers API.
  - How to use `req.body`, `req.params`, and `req.query` to get different types of information from a request.
- How to make a website responsive using CSS media queries.

## Future Improvements

There are several features I would like to add to this project in the future:

- Add more detailed book information from the Open Library API, such as the author, publication date, and description.
- Add user accounts so different users can have their own personal book collections.
- Add a search feature so users can quickly find a book in their collection.
- Improve the book cover display and handle cases where a cover is not available.
- Add better validation for the book title, rating, and ISBN.
- Improve the responsive design for different screen sizes and devices.
- Add a better way to manage database credentials instead of keeping them directly in the project code.
- Add pagination if the number of saved books becomes large.
- Add more sorting and filtering options.
- Improve the overall design and user experience as I continue learning.
