const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('./helpers');

app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(morgan());

app.set("view engine", "ejs");

let users = { 
  "1": {
    id: "1", 
    email: "user@example.com", 
    password: "abc"
  },
 "2": {
    id: "2", 
    email: "user2@example.com", 
    password: "def"
  }
}




const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const bodyParser = require('body-parser');
const { get } = require("request");
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req,res)=>{
  res.redirect('/login');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

function generateRandomString(length) {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++ ) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}  

app.get('/urls.json',(req,res)=>{
  res.json(urlDatabase);
})



// app.get("/set", (req, res) => {
//  const a = 1;
//  res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//  res.send(`a = ${a}`);
// });

function urlsForUser(id){
  let result = {};
  for(var key in urlDatabase){
    if(urlDatabase[key].userID === id) {
      result[key] = {
        shortURL: key,
        longURL: urlDatabase[key].longURL
      }
    }
  }
  return result;
}

app.get('/urls', (req,res)=>{
  const UserID = req.session.user_id;
  let result = urlsForUser(UserID);
  if (!UserID) {
    return res.redirect('/login');
  }  
  else if (UserID) {
  const templateVars = { urls: result,
                         username: users[req.session.user_id]
                        }; 
  console.log(templateVars)                      
  return res.render("urls_index", templateVars);
  }
})


app.get('/urls/new', (req,res)=>{
    if (!req.session.user_id) {
      return res.redirect('/login');
    }
    const templateVars = { username: users[req.session.user_id]}
    return res.render('urls_new', templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
  const UserID = req.session.user_id;
  if (!UserID) {
    return res.send("please proceed to login page")
  } 
  // for (key in urlDatabase) {
  //   if (key !== req.params.shortURL) {
  //     return res.send(" URL with the given ID doesn't exist")
  //   }
  // }
  const templateVars = { shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: users[req.session.user_id]
    }
    return res.render("urls_show", templateVars);  
});


app.post("/urls", (req, res) => {
    //console.log(req.body); // Log the POST request body to the console
    const longURL= req.body.longURL;
    const shortURL = generateRandomString(6);
    const UserID = req.session.user_id;
  
    let tempObject = {
      longURL: longURL,
      userID: UserID
    };
    urlDatabase[shortURL] = tempObject;
//    urlDatabase[shortURL].UserID = UserID;
    res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  for (key in urlDatabase) {
    if (key === req.params.shortURL) {
      const longURL = urlDatabase[req.params.shortURL].longURL;
      return res.redirect(longURL);      
    }
  }
  return res.send(" Not the correct shortURL");
}); 

app.get("/login", (req,res)=>{
    const UserID = req.session.user_id;
    if (UserID) {
      const templateVars = { username: users[req.session.user_id]};
      return res.redirect('/urls');
    }
    const templateVars = { username: users[req.session.user_id]};
    res.render('urls_login', templateVars);
})

app.post("/urls/:shortURL/delete" , (req,res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
})

app.post("/urls/:id" , (req,res) => {
    console.log(req.params);
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect('/urls');
})

app.post("/login", (req,res) => {  
  if ((!req.body.email) || (!req.body.password)) {
    res.status(400).send('No input entry');
  }

let foundUser = getUserByEmail(req.body.email, users);
  if (!foundUser) {
    res.status(403).send(`no user found for user ID ${req.body.email}`);
} else {
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (bcrypt.compareSync(foundUser.password, hashedPassword)){
      req.session.user_id = users[user].id;
      res.redirect('/urls');
//      console.log( req.body.password, hashedPassword);
    } else {
//      console.log( req.body.password, hashedPassword);
      res.status(403).send('no password match');
    }
  }
})

app.post("/logout", (req,res) => {
  //       res.clearCookie('user_id' );
    req.session = null;
    res.redirect('/urls')
})

app.get("/register", (req,res)=> {
    res.render('urls_register');
});

app.post("/register", (req,res)=>{
    const new_id = generateRandomString(3);
    password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[new_id] = {  id : new_id,
                       email : req.body.email,
                       password : hashedPassword
                    }
    if ((!req.body.email) || (!req.body.password)) {
      res.status(400).send('No input entry')
    }
    for (user in users) {
      if (users[user].email.includes(req.body.email)) {
        res.status(400).send('this userId has already exist')
      }
      req.session.user_id = new_id;
      //   console.log(req.session.user_id)
      res.redirect('/urls')

    }           
})

})
