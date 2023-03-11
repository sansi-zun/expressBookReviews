const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next){
    const auth = req.session.authorization;
    if (!auth) {
        return res.status(403).json({message: "user not logged in"});
    } 
    jwt.verify(auth.accessToken, "access", (err, user) => {
        if (err) {
            return res.status(403).json({message: "user not authenticated"});
        }
        req.user = user;
        next();
    });
});
 
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
