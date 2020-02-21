const {emailExists} = require('./helpers')
const express = require("express");
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
var app = express()
// app.use(cookieSession())
app.use(cookieSession({
  name: 'session',
  keys: ["asdasdasd"],
  // Cookie Options
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Random string generator
const randomString = function() {
  const p = "abcdefghijklmnopqrstuvwxyz0123456789"
  const startingArray = p.split("")
  let finalArray = []
  for (i = 0; i < 6; i++) {
    finalArray.push(startingArray[Math.floor(Math.random() * 36)])
  }
  return finalArray.join("")

}


// passwordFinder helper function
const passwordExists = function(password) {
  for (Id in users) {
    if (bcrypt.compareSync(password, users[Id].password)) {
      console.log('passwordexists');
      return true
    }
  }
};

// ID catcher helper function 
const idCatcher = function(password) {
  for (Id in users) {
    if (passwordExists(password)) {
      console.log('id corresponding to pw found');
      return Id
    }
  }
  return false
};

// Confirm that the cx username and pw match
const identityConfirm = function(email, password) {
  if (users[idCatcher(password)]["email"] === email) {
    console.log(' id confirmed');
    return true
  }
}

const urlsForUser = function(id, urlDatabase) {
  const personalURLs = {}
  for (shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].Id) {
      personalURLs[shortURL] = urlDatabase[shortURL]
    }
  }
  return personalURLs
};



// Defining urlDatabase

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", Id: "dsaaw3" },
  "9sm5xK": { longURL: "http://www.google.com", Id: "dsaaw2" },
  "j4yori": { longURL: 'http://www.tile.com', Id: "asds" }
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

});

// Setting up users database

const users = {
  '5wp9i9':
  {
    id: '5wp9i9',
    email: 'd@d.ca',
    password: bcrypt.hashSync('123', 10)
  }
}

// route to handle get request to "/urls"

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase),
  user: users[req.session.user_id]
  };
  if(req.session.user_id){
  res.render("urls_index", templateVars);
  } else {
    res.redirect("/logintoview")
  }
});

// route to handle redirect from "/urls" if user isn't logged in
app.get("/logintoview", (req, res) => {
  let templateVars = { user: users[req.session.user_id]
    };
  res.render("loginToView", templateVars);
});


// setting up route to the new URL page, will render the form on new URL page

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login", templateVars);
  }
});

// Establishing a route to the registration page
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_register", templateVars);
});

// Establishing a route to /login endpoint

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

// setting up route to the page that the user will be redirected to when they create a new shortURL

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"],
    user: users[req.session.user_id]
  };
  const userDatabase = urlsForUser(req.session.user_id, urlDatabase);
  if(!userDatabase[req.params.shortURL]){
    return res.redirect("/login");
  }
  if (req.session.user_id) {
    if (urlsForUser(req.session.user_id, urlDatabase)[req.params.shortURL].Id === req.session.user_id) {
      res.render("urls_show", templateVars);
    } else {
      res.redirect("/login");
    }
  }
  else {
    res.redirect("/login");
  }
}
);

// setting up route to the destination website once we click on the shortURL link

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"]
  res.redirect(longURL);
});

// setting up route to the page where newly created shorturl is shown once it is generated and stored in the database

app.post("/urls", (req, res) => {

  const newShortURL = randomString();
  const newLongURL = req.body["longURL"]
  // urlDatabase[newShortURL] = newLongURL
  urlDatabase[newShortURL] = {
    "longURL": newLongURL,
    "Id": req.session.user_id
  }
  res.redirect("/urls/" + newShortURL);
});

// routing to facillitate the delete feature

app.post("/urls/:url/delete", (req, res) => {
  if (req.session.user_id) {
    if (urlsForUser(req.session.user_id, urlDatabase)[req.params.url]) {
      if (urlsForUser(req.session.user_id, urlDatabase)[req.params.url].Id === req.session.user_id) {
        delete urlDatabase[req.params.url]
        res.redirect("/urls");
      } else {
        res.redirect("/login");
      }
      }
      else {
        res.redirect("/login");
      }
    }
    else {
      res.redirect("/login");
  }

});

// routing to facillitate the update feature

app.post("/urls/:shortURL/update", (req, res) => {
  if (req.session.user_id) {
    if(urlsForUser(req.session.user_id, urlDatabase)[req.params.shortURL]){
      if (urlsForUser(req.session.user_id, urlDatabase)[req.params.shortURL].Id === req.session.user_id) {
        urlDatabase[req.params.shortURL]["longURL"] = req.body["longURL"]
        res.redirect("/urls");
      } else {
        res.redirect("/login");
      }
    }
    else {
      res.redirect("/login");
    }
  }
  else {
    res.redirect("/login");
  }
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
  if (!emailExists(email, users)) {
    res.status(403).send("403 ERROR")
  } else {
    if (passwordExists(password) === true && identityConfirm(email, password) === true) {
      // res.cookie("user_id", idCatcher(password) )
      console.log('successful login');
      req.session.user_id = idCatcher(password);
      res.redirect("/urls");
    } else {
      res.status(422).send("422 ERROR")
    }
  }
});

// clearing cookie once the logout button is clicked. 

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls")
});

// handling the post request to the /register endpoint (adding a user to the users db) if user exists or no email add. provided, send a 404 error. 

app.post("/register", (req, res) => {
  const userId = randomString();
  const email = req.body["email"]
  const password = req.body["password"];
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (emailExists(email) === true || email === "") {
    res.status(404).send("404 ERROR")
  } else {
    users[userId] = {
      "id": userId,
      "email": email,
      "password": hashedPassword
    }

    // res.cookie("user_id", userId)
    req.session.user_id = userId;
    res.redirect("/urls");
  }
});