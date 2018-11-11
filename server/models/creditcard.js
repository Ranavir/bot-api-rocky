const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const _ = require('lodash');

var CreditCard = mongoose.model('CreditCard', {
  cc_bank_name : {
    type : String,
    required : true,
    minlength : 3,
    trim : true
  },
  cc_card_no : {
    type : String,
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
    type : Number,
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
    required : false,
    trim : true
  },
  cc_valid_thru : {
    type : String,
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
    required : false,
    minlength : 3,
    trim : true
  },
  cc_inb_username : {
    type : String,
    required : false,
    trim : true
  },
  cc_inb_password : {
    type : String,
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

module.exports={CreditCard};
