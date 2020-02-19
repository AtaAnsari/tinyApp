const express = require("express");
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Random string generator
const randomString = function(){
  const p = "abcdefghijklmnopqrstuvwxyz0123456789"
  const startingArray = p.split("")
  let finalArray = []
  for(i = 0; i < 6; i++) {
    finalArray.push(startingArray[Math.floor(Math.random()*36)])
  }
  return finalArray.join("")
  
}

// emailFinder helper function 
const emailExists = function(email){
  for(Id in users){
    if(users[Id]["email"] === email) {
      console.log("found a match!")
      return true
    }
  }
  console.log(users[Id]["email"])
  return false
};

// Defining Database

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  
});

// Setting up users database

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


// setting up route to the main page, will render main page

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

// setting up route to the new URL page, will render the form on new URL page

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

// Establishing a route to the registration page
app.get("/register", (req, res) => {
  let templateVars = {
    username: req.cookies["username"] };
  res.render("urls_register", templateVars);
});


// setting up route to the page that the user will be redirected to when they create a new shortURL

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
  username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// setting up route to the destination website once we click on the shortURL link

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

// setting up route to the page where newly created shorturl is shown once it is generated and stored in the database

app.post("/urls", (req, res) => {

  const newShortURL = randomString();
  const newLongURL = req.body["longURL"]
  urlDatabase[newShortURL] = newLongURL
  res.redirect("/urls/"+ newShortURL);
});

// routing to facillitate the delete feature

app.post("/urls/:url/delete", (req, res) => {
  delete urlDatabase[req.params.url]
  res.redirect("/urls");
});

// routing to facillitate the update feature

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body["longURL"]
  res.redirect("/urls");
});

// routing to the show url page once the edit button is clicked on the main page

app.post("/urls/:url/edit", (req, res) => {
  res.redirect("/urls/" + req.params.url);
});

// setting username cookie once username is submitted

app.post("/login", (req, res) => {
  res.cookie("username", req.body["username"] )
  res.redirect("/urls")
});

// clearing cookie once the logout button is clicked. 

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls")
});

// handling the post request to the /register endpoint (adding a user to the users db) if user exists or no email add. provided, send a 404 error. 

app.post("/register", (req, res) => {
  const userId = randomString();
  const email = req.body["email"]
  const password = req.body["password"]
  if(emailExists(email) === true || email === ""){
    res.status(404).send("404 ERROR")
  } else {
  users[userId] =   {
    "id": userId,
  "email": email,
  "password": password
  }
  res.cookie("user_id", userId)
  res.redirect("/urls");
}
});