const mongoose            = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy         = require('passport-local'),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    express               = require('express'),
    User                  = require('./models/user'),
    port                  = 3000,
    app                   = express()

mongoose.connect('mongodb://localhost/auth_demo_app', {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(require('express-session')({
    secret: "There are many screts",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//////////////
/////Route////
//////////////

app.get('/', function(req, res){
    res.render('home')
})

app.get('/secret',isLoggedIn, function(req, res){
    res.render('secret')
})

// Auth Routes-------------

// SHOW Sign up form
app.get('/register', function(req, res){
    res.render('register')
})

// Handling user sign up
app.post('/register', function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('register')
        } else {
            // Login process
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secret')
            })
        }
    })
})

// SHOW Log In form
app.get('/login', function(req, res){   
    res.render('login')
})

// Handling user Log In
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function(req, res){
})

// SHOW Log Out Routing
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }  
    res.redirect('/login')
}


app.listen(port, function(){
    console.log("connected!!")
})