const db = require('./connection_model');

function IndexModel() {
    this.register_admin = (admin_details, callback) => {
       
        db.collection("register")
          .find()
          .toArray()
          .then((result) => {
            // result== stored data
            
            if (result.length > 0) {
              var max_id = result[0]._id;
              for (const row of result) {
                if (max_id < row._id) {
                  max_id = row._id;
                }
              }
    
              admin_details._id = max_id + 1;
            } else {
              admin_details._id = 1;
            }
            //logic to check if any data is stored in database,if yes than check if the stored mail id
            var flag = 1;
            if (result.length > 0) {
              for (const row of result) {
                if (admin_details.email == row.email) {
                  flag = 0;
                  break;
                }
              }
            }
    
            if (flag == 1) {
              admin_details.role = "user";
              admin_details.status = 0;
              admin_details.dt = Date();
              admin_details.dob = null;
              admin_details.profile_pic="profile_photo.png";
              admin_details.alt_phone_number= null;
              
              db.collection("register").insertOne(admin_details, (error, result) => {
                if (error) {
                  callback(error);
                } else {
                  callback(result);
                }
              });
            } else {
              callback(false);
            }
          })
          .catch((error) => {
            console.log("catch error" + error);
            callback(error);
          });
      };
   
   
   
      var admin_data={}
      this.login_admin=(admin_details,callback)=>{

        db.collection('register').find({"email":admin_details.email,"password":admin_details.password,"status":1}).toArray()
        .then((result)=>{
    
      admin_data=result
      callback(result)
        })
        .catch((error)=>{
          error
      
      callback(error)
        })
       }
    

      
      this.get_admin_details = (email,password, callback) => {
// 
        db.collection("register")
          .find({ email: email, password: password })
          .toArray()
          .then((result) => {
          
            callback(result);
          })
          .catch((error) => {
          
            console.log(error);
          });
      };


      var all_users=[]
      this.get_users_details=(callback)=>{
        
        db.collection("register")
        .find({ role: "user" }) 
        .toArray()
        .then((result) => {
          callback(result);
        })
        .catch((err) => {
          callback(err);
        });
      }


      this.update_user_status = (details, callback) => {
        if (details.s == "block") {
          db.collection("register")
            .updateOne({ _id: parseInt(details.regId) }, { $set: { status: 0 } })
            .then((result) => {
              callback(true);
            })
            .catch((err) => {
              callback(false);
            });
        } else if (details.s == "verify") {
          db.collection("register")
            .updateOne({ _id: parseInt(details.regId) }, { $set: { status: 1 } })
            .then((result) => {
              callback(true); 
            })
            .catch((err) => {
              callback(false);
            });
        } else {
          db.collection("register")
            .deleteOne({ _id: parseInt(details.regId) })
            .then((result) => {
              callback(true);
            })
            .catch((err) => {
              callback(false);
            });
        }
      };

       this.update_profile=(id,folder_name,profile_pic_file_name,updated_details,callback)=>{
         full_name=updated_details.full_name;
         username=updated_details.username;
         email=updated_details.email;
         phone_number=updated_details.phone_number;
         alt_phone_number=updated_details.alt_phone_number;
         password=updated_details.password;
         gender=updated_details.gender;
         dob=updated_details.dob;
        profile_pic=folder_name;
        profile_pic_name=profile_pic_file_name;
        db.collection("register")
        .updateOne({ _id: id}, { $set: { _id: id ,full_name:full_name,username:username,email:email,phone_number:phone_number,alt_phone_number:alt_phone_number,
          password:password,gender:gender,dob:dob,profile_pic:profile_pic,profile_pic_name:profile_pic_name} })
        .then((result) => {
          callback(true); 
        })
        .catch((err) => {
          callback(false);
        });
      
        
        
       }
    

  } 




                  
module.exports = new IndexModel();
