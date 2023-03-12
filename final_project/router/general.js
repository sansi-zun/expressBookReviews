const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(406).json({ message: "unable to register user" });
    }
    else if (isValid(username)) {
        return res.status(406).json({ message: "user is already registered" });
    }

    users.push({ username, password });
    res.send({ message: `user ${username} successfully registered` });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    res.send(JSON.stringify({ books }, null, 4));
});

// TASK 10 - Get the book list available in the shop using promises
public_users.get('/async', (req, res) => {
    const prom = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({ books }, null, 4)));
    });
    prom.then(() => console.log("Promise for Task 10 resolved"));
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

// TASK 11 - Get book details based on ISBN using promises
public_users.get('/async/isbn/:isbn', (req, res) => {
    const prom = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (!book) {
            reject(res.status(404).json({ message: `no book with isbn ${isbn}` }));
        }
        else {
            resolve(res.send(book));
        }
    });
    prom.then(() => console.log("Promise for Task 11 resolved"));
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

// TASK 12 - Get book details based on author using promises
public_users.get('/async/author/:author', (req, res) => {
    const prom = new Promise((resolve, reject) => {
        const author = req.params.author;
        const foundBooks = Object.keys(books)
            .map(x => books[x])
            .filter(x => x.author === author);
        if (foundBooks.length === 0) {
            reject(res.status(404).json({ message: `no books with author ${author}` }));
        }
        else {
            resolve(res.send(foundBooks));
        }
    });
    prom.then(() => console.log("Promise for Task 12 resolved"));
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

// TASK 13 - Get all books based on title using promises
public_users.get('/async/title/:title', (req, res) => {
    const prom = new Promise((resolve, reject) => {
        const title = req.params.title;
        const foundBooks = Object.keys(books)
            .map(x => books[x])
            .filter(x => x.title === title);
        if (foundBooks.length === 0) {
            reject(res.status(404).json({ message: `no books with title ${title}` }));
        }
        else {
            resolve(res.send(foundBooks));
        }
    });
    prom.then(() => console.log("Promise for Task 13 resolved"));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `no book with isbn ${isbn}` });
    }
    res.send(book.review);
});

module.exports.general = public_users;
