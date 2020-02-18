const express = require("express");

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const randomString = function(){
    const p = "abcdefghijklmnopqrstuvwxyz0123456789"
    const startingArray = p.split("")
    let finalArray = []
    for(i = 0; i < 6; i++) {
      finalArray.push(startingArray[Math.floor(Math.random()*36)])
    }
    return finalArray.join("")
    
  }
  const newShortURL = randomString();
  const newLongURL = req.body["longURL"]
  urlDatabase[newShortURL] = newLongURL

  console.log(urlDatabase);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect("/urls/"+ newShortURL);
});

// POST /urls/:shortURL/delete

app.post("/urls/:url/delete", (req, res) => {
  delete urlDatabase[req.params.url]
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body["longURL"]
  res.redirect("/urls");
});

app.post("/urls/:url/edit", (req, res) => {
  res.redirect("/urls/" + req.params.url);
});


