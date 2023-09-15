var express = require("express");
const index_model = require("../model/index_model");
var router = express.Router();
var path = require("path");
var url = require("url");

// middleware to check user if user details is stored in session or not

router.use((req, res, next) => {
  if (req.session.admin_email != undefined && req.session.admin_role) {
    next();
  } else {
    res.redirect("/login");
  }
});

/*
Middleware function to fetch all category
*/ var data = {};
router.use("/", (req, res, next) => {
  index_model.get_admin_details(
    req.session.admin_data.email,
    req.session.admin_data.password,
    (result) => {
      data = result[0];
      next();
    }
  );
  `  `;
});

// profile update  // account
router.post("/account", function (req, res, next) {
  var file_name = req.files.profile_pic;
  var updated_data = req.body;
  var profile_pic = Date.now() + "-" + file_name.name;
  
  var folder_name = path.join(
    __dirname,
    "../public/upload/profile_pic",
    profile_pic
  );
  index_model.update_profile(
    data._id,
    folder_name,
    profile_pic,
    updated_data,
    (result) => {
      
      file_name.mv(folder_name,(error)=>{
        if (error) {
          console.log("error uploading photo", error);
        } else {
          console.log("photo uploaded successfully");
        }
      });
      
      res.render("admin/home", { data: data });
    }
  );
});

/* GET home page. */
var admin_data = {};

router.get("/", function (req, res, next) {
  admin_data = req.session.admin_data;
  
  res.render("./admin/home", { data: data });
});

router.get("/account", function (req, res, next) {
  res.render("./admin/account", { data: data });
});

router.get("/manage_employee", function (req, res, next) {
  index_model.get_users_details((result) => {
    res.render("./admin/manage_employee", { data: data, userDetails: result });
  });
});

router.get("/update_user_status", function (req, res, next) {
  var details = url.parse(req.url, true).query;
  index_model.update_user_status(details, (result) => {
    res.redirect("/admin/manage_employee");
  });
});

router.get("/to_do_list", function (req, res, next) {
    res.render("./admin/to_do_list", { data: data });
  });





module.exports = router;
