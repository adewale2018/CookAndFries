const express = require('express'),
router        = express.Router(),
passport      = require('passport'),
User          = require('../models/user');

// root route
router.get('/', (req, res) => {
    res.render('landing');
});


// AUTHENTICATION ROUTE

// SHOW SINGUP FORM
router.get('/register', (req, res) => {
    res.render('register');
});

// HANDLES SIGNUP LOGIC
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to Cook & Fries ' + user.username);
            res.redirect('/cookings');
        });
    });
});

// LOGIN FORM
router.get('/login', (req, res) => {
    res.render('login');
});

// HANDLING LOGIN LOGIC
router.post('/login', passport.authenticate('local', {
    successRedirect: '/cookings',
    failureRedirect: '/login'
}), (req, res) => {

}); 

// LOGOUT

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logout Succesfully!');
    res.redirect('/cookings');
});

// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// } 

module.exports = router;