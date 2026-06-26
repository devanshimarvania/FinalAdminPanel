const express = require('express');
const port = 9000;
const db = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const flash = require('connect-flash');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'adminpanel',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ==== ALL ROUTES ====
app.use('/', require('./routes/adminRoutes'));
app.use('/', require('./routes/categoryRoutes'));
app.use('/', require('./routes/subCategoryRoutes'));
app.use('/', require('./routes/productRoutes')); // <-- Added Product Routes here

app.listen(port, (err) => {
    if (err) {
        console.log("Error to Start Server......");
    } else {
        console.log(`Server running at http://localhost:${port}`);
    }
});