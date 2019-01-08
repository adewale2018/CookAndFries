const express = require('express'),
router        = express.Router({mergeParams: true}),
Cooking       = require('../models/cooking'),
Comment       = require('../models/comment'),
middleware    = require('../middleware');

/*
    COMMENT ROUTES
*/
//comment new
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Cooking.findById(req.params.id, (err, cooking) => {
        if(err) {
            console.log(err);
        } else{
            res.render('comments/new', {cooking:cooking});
        }
    });
   
});

//comment create
router.post('/', middleware.isLoggedIn, (req, res) => {
    //lookup cooking using ID
    Cooking.findById(req.params.id, (err, cooking) => {
        if(err) {
            res.redirect('/cookings');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                 req.flash('error', 'Oops!, Something went wrong.');
                 console.log(err);   
                } else {
                    req.flash('success', 'Successfully created a new comment');
                    // add username and id to the comment
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    cooking.comments.push(comment);
                    cooking.save();
                    res.redirect('/cookings/'+ cooking._id);
                }
            })
        }
    })
    //create new comment
    //connect new comment to cooking
    //redirect to cooking show page 
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {cooking_id: req.params.id, comment:foundComment});
        }
    });
    
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment ) => {
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/cookings/' + req.params.id);
        }
    });
});

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
        if(err) {
            req.flash('error', 'Oops!, Something went wrong.');
            res.redirect('back');
        } else {
            req.flash('success', 'Deleted successfully.');
            res.redirect('/cookings/' + req.params.id);
        }
    });
});

//middleware
//checkCommentOwnership

// isLoggedIn


module.exports = router;