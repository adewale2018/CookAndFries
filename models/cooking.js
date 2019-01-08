const mongoose = require('mongoose');

// SCHEMA
let cookingSchema = new mongoose.Schema({
    chef: String,
    title: String,
    ingridients: String,
    procedure: String,
    author: {
            id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
            username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//let Cooking = mongoose.model('Cooking', cookingSchema);

module.exports = mongoose.model('Cooking', cookingSchema);