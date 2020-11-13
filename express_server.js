const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use(cookieParser());
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
app.get('/', (req, res) => {
  res.send("Hello!");
});

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
  const UserID = req.cookies.user_id;
  let result = urlsForUser(UserID);

  const templateVars = { urls: result,
                         username: users[req.cookies.user_id]
                        }; 
  console.log(templateVars)                      
  res.render("urls_index", templateVars);
})


app.get('/urls/new', (req,res)=>{
    if (!req.cookies.user_id) {
      return res.redirect('/login');
    }
    const templateVars = { username: users[req.cookies.user_id]}
    return res.render('urls_new', templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, 
                           longURL: urlDatabase[req.params.shortURL].longURL,
                           username: users[req.cookies.user_id]
                         };
    res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
    //console.log(req.body); // Log the POST request body to the console
    
    const longURL= req.body.longURL;
    const shortURL = generateRandomString(6);
    const UserID = req.cookies.user_id;
  
    let tempObject = {
      longURL: longURL,
      userID: UserID
    };
    urlDatabase[shortURL] = tempObject;
//    urlDatabase[shortURL].UserID = UserID;
    res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});



app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }); 

app.get("/login", (req,res)=>{
    const templateVars = { username: users[req.cookies.user_id]};
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



const findUserByEmail = function(email) {
//  console.log("finding user by email");
  for (user in users) {
//    console.log(`Comparing email ${users[user].email} to ${email}...`);
    if (users[user].email === email) {
      return users[user];
    }
  }
};

app.post("/login", (req,res) => {  
  if ((req.body.email === "") || (req.body.password === "")) {
    res.status(400).send('No input entry');
  }

  // other approach
//  console.log(req.body);
  let foundUser = findUserByEmail(req.body.email);
  if (!foundUser) {
    res.status(403).send(`no user found for user ID ${req.body.email}`);
  } else {
    if (foundUser.password === req.body.password) {
      res.cookie('user_id', users[user].id);
      res.redirect('/urls');
    } else {
//      console.log(`password ${foundUser.password} does not match ${req.body.password}!`);
      res.status(403).send('no password match');
    }
  }
});

app.post("/logout", (req,res) => {
          res.clearCookie('user_id' );
    //      console.log(req.cookies)
          res.redirect('/urls')
    })

app.get("/register", (req,res)=> {

    res.render('urls_register');

});

app.post("/register", (req,res)=>{
    const new_id = generateRandomString(3);
    users[new_id] = {  id : new_id,
                       email : req.body.email,
                       password : req.body.password
                    }
    if ((req.body.email === "") || (req.body.password === "")) {
      res.status(400).send('No input entry')
    }
    for (user in users) {
      if (users[user].email.includes(req.body.email)) {
        res.status(400).send('this userId has already exist')
      }
      res.cookie('user_id', new_id);
      //   console.log(req.cookies)
      res.redirect('/urls')

    }           
})


});

  