const express = require('express'),
router        = express.Router(),
Cooking       = require('../models/cooking'),
middleware    = require('../middleware');

router.get('/', (req, res) => {
    Cooking.find({}, (err, allCookings) => {
        if(err){
            console.log('The Error is: ' + err);
        } else {
            res.render('cookings/index',{cookings:allCookings, currentUser: req.user});
        }
    });
   
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    let chef = req.body.chef;
    let title = req.body.title;
    let ingridients = req.body.ingridients;
    let procedure = req.body.procedure;
    let author    = {
        id: req.user._id,
        username: req.user.username
    }
    let newCooking = {chef:chef, title:title, ingridients:ingridients, procedure:procedure, author:author};
    Cooking.create(newCooking, (err, newlyCreatedCooking) => {
        if(err){
            req.flash('error', 'Oops!, Something went wrong.');
            console.log('The Error is: '+ err);
        } else {
            req.flash('success', 'Created succesffully.');
            res.redirect('/cookings');
        }
    });
   

});

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('cookings/new');
});

router.get('/:id', (req, res) => {
    // find the cooking with the provided id
    Cooking.findById(req.params.id).populate('comments').exec((err, foundCooking) => {
        if(err){
            console.log('The error is: ' + err);
        } else {
            res.render('cookings/show', {cooking: foundCooking});
        }
    });
   
});

router.get('/:id/edit', middleware.checkCookingOwnership, (req, res) => {
    // is user logged in?
    Cooking.findById(req.params.id, (err, foundCooking) => {
        res.render('cookings/edit',{cooking: foundCooking});
                
    });
});

router.put('/:id', middleware.checkCookingOwnership, (req, res) => {
    //find and update the correct cooking
    Cooking.findByIdAndUpdate(req.params.id, req.body.cooking, (err, foundAndUpdated) => {
        if(err) {
            res.render('/cookings');
        } else {
            // redirect somewhere probably, the show page
            res.redirect('/cookings/' + req.params.id);
        }
    });
    
});

router.delete('/:id', middleware.checkCookingOwnership, (req, res) => {
    Cooking.findByIdAndDelete(req.params.id, (err) =>{
        if(err) {
            res.redirect('/cookings');
        } else {
            res.redirect('/cookings');
        }
    });
});

// middleware
//checkCookingOwnership
// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// } 


module.exports = router;