const express = require("express");
const app = express();
const PORT = 3000; // default port 8080


app.set("view engine", "ejs");




const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

app.get('/urls.json',(req,res)=>{
  res.json(urlDatabase);
})

app.get('/hello', (req,res)=>{
  res.send('<html><body>Hello <b>World</b></body></html>\n');
})

// app.get("/set", (req, res) => {
//  const a = 1;
//  res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//  res.send(`a = ${a}`);
// });

app.get('/urls', (req,res)=>{
  const templateVars = { urls: urlDatabase }; 
  res.render("urls_index", templateVars);
})

app.get('/urls/new', (req,res)=>{
    res.render('urls_new');
})

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: "http://www.lighthouselabs.ca" };
    res.render("urls_show", templateVars);
});



app.post("/urls", (req, res) => {
    //console.log(req.body); // Log the POST request body to the console
    
    const longUrlContainer = req.body.longURL;
    const shortUrlContainer = generateRandomString(6);
 
    urlDatabase[shortUrlContainer] = longUrlContainer;
        
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
  });

function generateRandomString(length) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}  

});

  