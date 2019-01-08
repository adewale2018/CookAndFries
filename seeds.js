const mongoose = require('mongoose'),
Cooking        = require('./models/cooking'),
Comment        = require('./models/comment')

let data = [
    {
        chef: "Ummu Aasiyah", 
        title: "Meatpie", 
        ingridients: "1kg of Flour, 250g of butter, a pinch of salt", 
        procedure: "procedures will be here"
    },
    {
        chef: "Sister Ruqoyyah", 
        title: "Salad", 
        ingridients: "5 cups of Rice, 250g of butter, a pinch of salt, groundnut oil, fish, meat, carrot", 
        procedure: "procedures will be here later later, trust here"
    },
    {
        chef: "Abu Aasiyah", 
        title: "Eba & Efo riro", 
        ingridients: "5 cups of Rice, 250g of butter, a pinch of salt, groundnut oil, fish, meat, carrot", 
        procedure: "procedures will be here later later, trust here"
    }

];

let seedDB = () => {
    Cooking.remove({}, (err) => {
        if(err) {
            console.log('The Error is: ' + err);
        } else {
            console.log('Removed all the cookings in the database');
            // craete few cookings
        data.forEach((seed) => {
            Cooking.create(seed, (err, cooking) => {
                if(err) {
                    console.log('The Error is: ' + err);
                } else {
                    console.log('The database has been seeded successfully');
                // add few comment
                Comment.create(
                    {
                        text: "This is nice, keep it up sister!!",
                        author: "Hamdala"
                    }, (err, comment) => {
                        if(err) {
                            console.log('The Error is: ' + err);
                        } else {
                            cooking.comments.push(comment);
                            cooking.save();
                            console.log('Comment is created');
                        }
                    });
                }
            });
        });

        }
    });
    
    // add few comments
}

module.exports = seedDB;