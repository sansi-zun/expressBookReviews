const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `no book with isbn ${isbn}` });
    }
    res.send(book);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const foundBooks = Object.keys(books)
        .map(x => books[x])
        .filter(x => x.author === author);
    if (foundBooks.length === 0) {
        return res.status(404).json({ message: `no books with author ${author}` });
    }
    res.send(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const foundBooks = Object.keys(books)
        .map(x => books[x])
        .filter(x => x.title === title);
    if (foundBooks.length === 0) {
        return res.status(404).json({ message: `no books with title ${title}` });
    }
    res.send(foundBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
