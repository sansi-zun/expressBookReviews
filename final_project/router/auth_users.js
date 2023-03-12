const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");

const regd_users = express.Router();

const users = [];

const isValid = (username) => {
    return users.some(x => x.username === username)
}

const authenticatedUser = (username, password) => {
    return users.some(x => x.username === username && x.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!authenticatedUser(username, password)) {
        return res.status(406).json({message: "invalid username or password"});
    }

    const accessToken = jwt.sign({
        data: password
    }, "access", { expiresIn: 60 * 60});
    req.session.authorization = {accessToken, username};

    res.send(`user ${username} successfully logged in`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `no book with isbn ${isbn}` });
    }

    book.reviews[req.session.authorization.username] = req.body.review;
    res.send("review successfully added or modified");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `no book with isbn ${isbn}` });
    }

    delete book.reviews[req.session.authorization.username];
    res.send(`review successfully deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
