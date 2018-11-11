const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const _ = require('lodash');
const {encrypt,decrypt} = require('../utils/cryptutils');



var EmailSchema = new mongoose.Schema({
  email_provider : {
    type : String,
    required : true,
    minlength : 3,
    trim : true
  },
  email_id : {
    type : String,
    required : true,
    trim : true
  },
  email_password : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : true,
    minlength : 5,
    trim : true
  },
  createdAt : {
    type : Date,
    default: Date.now,
    required : false
  },
  _user : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  }
});
//overrride mongoose toJSON method
EmailSchema.methods.toJSON = function(){
  var email = this;
  var emailObj = email.toObject();
  return _.omit(emailObj, ['_id','createdAt','_user']);
};

var Email = mongoose.model('Email',EmailSchema);
module.exports={Email};
