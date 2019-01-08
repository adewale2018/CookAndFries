// all middleware goes here
let Cooking = require('../models/cooking'),
    Comment = require('../models/comment');


let middlewareObj = {};
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                req.flash('error', 'Oops!, Something went wrong.');
                res.redirect('back');
            } else {
                // does he own the cooking?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'Permission Denied');
                    res.redirect('back');
                }
                
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that!.');
        res.redirect('back');
    }
}

middlewareObj.checkCookingOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Cooking.findById(req.params.id, (err, foundCooking) => {
            if(err) {
                req.flash('error', 'Sorry, not found!');
                res.redirect('back');
            } else {
                // does he own the cooking?
                if(foundCooking.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'Access Denied!');
                    res.redirect('back');
                }
                
            }
        });
    } else {
        req.flash('error', 'You must login first!');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in to continue');
    res.redirect('/login');
} 

module.exports = middlewareObj;