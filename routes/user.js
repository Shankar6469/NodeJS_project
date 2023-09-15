var express = require("express");
var router = express.Router();
const index_model = require("../model/index_model");




router.post('/api/register', function(req, res, next) {
  console.log("welcome to node backend(User) ")
  res.send("welcome to backend")
    // res.render('index', { title: 'Express' });
  }); 