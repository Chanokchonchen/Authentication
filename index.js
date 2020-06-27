require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
const bcrypt = require('bcrypt');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/UserDB",{
useUnifiedTopology: true,
useNewUrlParser: true,
});
const userSchema = new mongoose.Schema({
  email:String,
  password:String
})
const User = mongoose.model("user",userSchema);

app.get("/",(req,res) => {
  res.render("home");
})
app.get("/login",(req,res) => {
  res.render("login");
})
app.get("/register",(req,res) => {
  res.render("register");
})
app.post("/register",(req,res)=> {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    const newuser = new User ({
      email:req.body.email,
      password:hash
    })
    newuser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Register Success");
        res.render("secrets");
      }
    })
  });
});

app.post("/login",(req,res) => {
  User.findOne({email:req.body.email},(err,founduser) =>{
    if(err) {
      console.log(err);
    } else {
      if(founduser) {
        bcrypt.compare(req.body.password, founduser.password, function(err, result) {
          if(result) {
            res.render("secrets");
          } else {
            console.log("Invalid Email or Password");
          }
        });
      }
    }
  })
})



app.listen(3000,()=> {
  console.log("Server is running on port 3000");
})
