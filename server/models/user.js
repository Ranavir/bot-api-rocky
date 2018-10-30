const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
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
  tokens : [{
    access : {
      type : String,
      required : true
    },
    token : {
      type : String,
      required : true
    }
  }]
});

//overrride mongoose toJSON method
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){

    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    console.log('AuthToken:',token);
    // user.tokens.push({access,token});
    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(() => {
      return token;
    });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull : {
      tokens : {token} //pull out the token from tokens array where there is this provided token, also used ES6 syntax for token = token
    }
  });
};
UserSchema.statics.findByToken = function(token){
  var user = this;
  var decoded ;

  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log(`decoded :${decoded}`);
  }catch(e){
    return Promise.reject();
  }
  return User.findOne({
    '_id' : decoded._id,
    'tokens.access' : 'auth',
    'tokens.token' : token
  });
};

UserSchema.statics.findByCredentials = function(email, password){
  var user = this;

  return User.findOne({email}).then((user) => {
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
// var User = mongoose.model('User',{
//   email : {
//     type : String,
//     required : true,
//     minlength : 1,
//     trim : true,
//     unique : true,
//     validate : {
//       validator : validator.isEmail,
//       message : '{VALUE} is not a valid email'
//     }
//   },
//   password : {
//     type : String,
//     required : true,
//     minlength : 6
//   },
//   tokens : [{
//     access : {
//       type : String,
//       required : true
//     },
//     token : {
//       type : String,
//       required : true
//     }
//   }]
// });

module.exports={User};
