const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const _ = require('lodash');
const {encrypt,decrypt} = require('../utils/cryptutils');

var CreditCardSchema = new mongoose.Schema({
  cc_bank_name : {
    type : String,
    required : true,
    minlength : 3,
    trim : true
  },
  cc_card_no : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : true,
    length : 16,
    unique : true,
    trim : true
  },
  cc_type :{
    type : String,
    required : true,
    minlength : 4,
    trim : true
  },
  cc_pin : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : false,
    minlength: 4
  },
  cc_mobile_no : {
    type : Number,
    required : false,
    minlength : 10,
    trim : true
  },
  cc_email_id : {
    type : String,
    required : false,
    trim : true,
    validate : {
      validator : validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },
  cc_valid_from : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : false,
    trim : true
  },
  cc_valid_thru : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : false,
    minlength : 1,
    trim : true
  },
  cc_name_on_card : {
    type : String,
    required : false,
    minlength : 1,
    trim : true
  },
  cc_cvv : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : false,
    minlength : 3,
    trim : true
  },
  cc_inb_username : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : false,
    trim : true
  },
  cc_inb_password : {
    type : String,
    get : decrypt,
    set : encrypt,
    required : false,
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
var CreditCard = mongoose.model('CreditCard',CreditCardSchema);
module.exports={CreditCard};
