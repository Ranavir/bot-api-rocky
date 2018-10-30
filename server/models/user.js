const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    minlength : 1,
    trim : true,
    unique : true
  },
  email : {
    type : String,
    required : true,
    minlength : 1,
    trim : true,
    unique : true,
    validate : {
      validator : validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },
  password : {
    type : String,
    required : true,
    minlength : 6
  },
  adhar : {
    type : String,
    required : false,
    minlength : 12
  },
  pan : {
    type : String,
    required : false,
    minlength : 10
  },
  phone1 : {
    type : Number,
    required : false,
    minlength: 10
  }
});

//overrride mongoose toJSON method
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id','username','email','adhar','pan','phone1']);
};






// UserSchema.statics.findByCredentials = function(email, password){
//   var user = this;
//
//   return User.findOne({email}).then((user) => {
//     if(!user){
//         return new Promise().reject();
//     }
//     return new Promise((resolve, reject) => {
//       //check password by bcrypt compare first
//       bcrypt.compare(password,user.password, (err, res) =>{
//         if(res){
//           resolve(user);
//         }else{
//           reject();
//         }
//       });
//
//     });
//
//   });
//
// };


var User = mongoose.model('User',UserSchema);


module.exports={User};
