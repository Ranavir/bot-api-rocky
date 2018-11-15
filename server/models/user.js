const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {encrypt,decrypt} = require('../utils/cryptutils');

var UserSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    minlength : 1,
    trim : true,
    unique : true
  },
  password : {
    type : String,
    required : true,
    minlength : 6
  },
  gender : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  },
  fname : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  },
  mname : {
    type : String,
    required : false,
    minlength : 1,
    trim : true
  },
  lname : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
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
  address : {
    type : String,
    required : false,
    minlength : 1,
    trim : true
  },
  phone1 : {
    type : Number,
    required : false,
    minlength: 10
  },
  phone2 : {
    type : Number,
    required : false,
    minlength: 10
  },
  phone3 : {
    type : Number,
    required : false,
    minlength: 10
  },
  dob : {
    type : String,
    default: null,
    required : true
  },
  adhar : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : true,
    minlength : 12
  },
  pan : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : false,
    minlength : 10
  },
  ckyc : {
    type : String,
    get : decrypt,
    set : encrypt,
    default: null,
    required : false
  },
  createdAt : {
    type : Date,
    default: Date.now,
    required : false
  }
});

//overrride mongoose toJSON method
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.omit(userObject, ['password']);
};






UserSchema.statics.findByCredentials = function(username, password){
  var user = this;

  return User.findOne({username}).then((user) => {
    if(!user){
        return new Promise().reject();
    }
    return new Promise((resolve, reject) => {
      //check password by bcrypt compare first
      bcrypt.compare(password,user.password, (err, res) =>{
        if(res){
          resolve(user);
        }else{
          reject();
        }
      });

    });

  });

};

UserSchema.pre('save', function(next){//if u providing next then call next inside this otherwise don't provide next
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) =>{
      console.log('salt',salt);
      bcrypt.hash(user.password, salt, (err, hash) =>{
        console.log('hash',hash);
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});

var User = mongoose.model('User',UserSchema);


module.exports={User};
