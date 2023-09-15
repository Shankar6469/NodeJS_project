var express = require('express');
var router = express.Router();
var index_model = require('../model/index_model');



// whenever the login page render this middleware will work to destroyed the session if any session is active
// define varibles to stores cookies value

var cookies_email=""
var cookies_password=""

router.use('/login',(req,res,next)=>{
  
  //cookies check 
  if (req.cookies.cookie_email!=undefined) {

    cookies_email = req.cookies.cookie_email
    cookies_password = req.cookies.cookie_password
  
  }
  
  //session check 
  if(req.session.admin_email!=undefined){
    req.session.destroy((error)=>{
      if (error) {
    console.log(error)       
      } else {
        console.log('session destroyed')
      }
    })
  }
  next()
})



// session check




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); 

router.get('/login', function(req, res, next) {
  res.render('login/login',{msg:'','cookies_email':cookies_email,'cookies_password':cookies_password});
});


router.get('/register', function(req, res, next) {
  res.render('login/registerd/register');
});
module.exports = router;



router.post('/register', function(req, res, next) {
  index_model.register_admin(req.body,(result,data)=>{
    if (result) {
      res.render('login/login', { msg: 'User Register Successfully....', 'cookies_email':cookies_email,'cookies_password':cookies_password},);
    } else {
      res.render('login/login', { msg: 'Email already exist,Please try Sign IN','cookies_email':cookies_email,'cookies_password':cookies_password });
    }
  })
  
});

router.post('/login', function(req, res, next) {

  index_model.login_admin(req.body, (result) => {
    
    if (result.length > 0) {

      if (result[0].role=="admin") {
        req.session.admin_email =result[0].email
        req.session.admin_role =result[0].role
        req.session.admin_data=result[0]
  
        if (req.body.check!=undefined) {
          res.cookie("cookie_email",req.body.email,{maxAge:360000 * 24 * 365 })
          res.cookie("cookie_password",req.body.password,{maxAge:360000 * 24 * 365 })
        }
         
        // User authentication successful
        res.redirect('./admin');
      } else {
        res.render('./login/login', { msg: 'Only admin can login', 'cookies_email':"",'cookies_password':"" });  
      }

     
    } else {
      // User authentication failed
      
      res.render('./login/login', { msg: 'Please enter a valid input', 'cookies_email':"",'cookies_password':"" });
    }
  });
});


router.post('/api/register',(req,res,next)=>{

console.log("backend index.js")
  res.redirect('./user')
})

 

