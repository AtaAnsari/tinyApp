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
      return true
    }
  }
  return false
};

// passwordFinder helper function
const passwordExists = function(password){
  for(Id in users){
    if(users[Id]["password"] === password) {
      return true
    }
  }
};

// ID catcher helper function 
const idCatcher = function(password){
  for(Id in users){
    if(users[Id]["password"] === password) {
      return Id
    }
  }
  return false
};

// Confirm that the cx username and pw match
const identityConfirm = function (email, password) {
  if(users[idCatcher(password)]["email"] === email){
    return true
  }
}



// Defining urlDatabase

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", Id: "dsaaw3"},
  "9sm5xK": {longURL: "http://www.google.com", Id: "dsaaw2"},
  "j4yori": { longURL: 'http://www.tile.com', Id: "asds09" }
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
  },
  "asds":{
    id: "asds",
    email: "l@gmail.com",
    password: "l"
  }
}


// setting up route to the main page, will render main page

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  if(req.cookies["user_id"]){
    console.log(urlDatabase);
  res.render("urls_index", templateVars);
  } else {
    res.redirect("/login")
  }
});

// setting up route to the new URL page, will render the form on new URL page

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  if(req.cookies["user_id"]){
    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login", templateVars);
  }
});

// Establishing a route to the registration page
app.get("/register", (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_register", templateVars);
});

// Establishing a route to /login endpoint

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
});

// setting up route to the page that the user will be redirected to when they create a new shortURL

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"],
  user: users[req.cookies["user_id"]]
};
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
  // urlDatabase[newShortURL] = newLongURL
  urlDatabase[newShortURL] = {
      "longURL": newLongURL,
      "Id": req.cookies["user_id"]
  }
  console.log(urlDatabase)
  res.redirect("/urls/"+ newShortURL);
});

// routing to facillitate the delete feature

app.post("/urls/:url/delete", (req, res) => {
  delete urlDatabase[req.params.url]
  res.redirect("/urls");
});

// routing to facillitate the update feature

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL]["longURL"] = req.body["longURL"]
  res.redirect("/urls");
});

// routing to the show url page once the edit button is clicked on the main page

app.post("/urls/:url/edit", (req, res) => {
  res.redirect("/urls/" + req.params.url);
});

// setting up route for login link on header

app.get("/loginButton", (req, res) => {
  res.redirect("/login")
});

// handling post request from login page
app.post("/login", (req, res) => {
  const userId = randomString();
  const email = req.body["email"]
  const password = req.body["password"]
  if(!emailExists(email)){
    res.status(403).send("403 ERROR")
  } else {
    if(passwordExists(password) === true && identityConfirm(email, password) === true){
      res.cookie("user_id", idCatcher(password) )
      res.redirect("/urls");
    } else {
    res.status(403).send("403 ERROR")
  }
}
});

// clearing cookie once the logout button is clicked. 

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
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