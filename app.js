const express        = require('express'),
          app        = express(),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    flash            = require('connect-flash'),
    passport         = require('passport'),
    LocalStrategy    = require('passport-local'),
    methodOverride   = require('method-override'),
    Cooking          = require('./models/cooking'),
    Comment          = require('./models/comment'),
    User             = require('./models/user'),
    seedDB           = require('./seeds');
// requiring routes

const   commentRoutes = require('./routes/comments'),
        cookingRoutes = require('./routes/cookings'),
        indexRoutes   = require('./routes/index');

let url = process.env.DATABASEURL || "mongodb://localhost:27017/Learn_And_Teach_Cooking";
mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect('mongodb://localhost:27017/Learn_And_Teach_Cooking', {useNewUrlParser: true});
// mongoose.connect('mongodb://adewaleshittu:Shetima5717@ds251894.mlab.com:51894/cookandfries', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash()); 
// seedDB(); seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "My middle name is Adewale",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash('error');
    res.locals.success     = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/cookings',cookingRoutes);
app.use('/cookings/:id/comments', commentRoutes);

/* Cooking.create( 
    {
    chef: "Ummu Aasiyah", 
    title: "Meatpie", 
    ingridients: "1kg of Flour, 250g of butter, a pinch of salt", 
    procedure: "procedures will be here"
}, (err, cooking) => {
    if(err){
        console.log('The Error is: ' + err);
    } else {
        console.log('The created cooking is: ' + cooking);
    }
});
*/



app.listen(5000, () => console.log('Learn $ Teach Cooking Server Started!!!'));


// app.listen(process.env.PORT, process.env.IP, () => {
// console.log('Learn $ Teach Cooking Server Started!!!');
// });