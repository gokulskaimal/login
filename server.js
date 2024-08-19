// Import necessary modules

const express = require('express');           
const path = require('path');                 
const app = express();                        
const hbs = require('hbs');                   
const session = require('express-session');   
const nocache = require('nocache');           
const cookieParser = require('cookie-parser'); 


// Middleware Url

app.use(express.urlencoded({ extended: true }));


// Middleware JSON

app.use(express.json());

// Cookies 

app.use(cookieParser());

// Session management

app.use(session({
    secret: "keyboard cat",                   
    resave: false,                            
    saveUninitialized: true,                  
    cookie: { secure: false} 
}));


app.use(nocache());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Set the view engine 

app.set("view engine", 'hbs');

// Templates

app.set('views', './views');

// Username and Password

const username = 'admin';
const password = "admin@123";

// Middleware for authentication

function isAuthenticated(req, res, next) {


    if (req.session.user) {
        return next();                  
    } 
    else {
        
        res.render('login', { msg: req.session.passwordwrong ? "Invalid Credentials" : null });
        req.session.passwordwrong = false;    
    }
}

// Route for the home page

app.get('/', isAuthenticated, (req, res) => {
    res.render('home', { title: username });  
});

// Route for verifying 

app.post('/verify', (req, res) => {
    console.log(req.body);                    
    if (req.body.username === username && req.body.password === password) {
        req.session.user = username;          
        res.cookie('username', username); 
        res.redirect('/home');                
    } else {
        req.session.passwordwrong = true;     
        res.redirect("/");                    
    }
});

// Route for the home page 

app.get('/home', isAuthenticated, (req, res) => {
    const usernameCookie = req.cookies.username;  
    res.render('home', { title: usernameCookie });  
});

// Route for logging out

app.get("/logout", (req, res) => {
    req.session.destroy();                    
    res.clearCookie('username');              
    res.render('login');                  
});

// Start the server

app.listen(2255, () => {
    console.log("http://localhost:2255");     
});
