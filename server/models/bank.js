const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const _ = require('lodash');

var Bank = mongoose.model('Bank', {
  bank_name : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  },
  account_no : {
    type : String,
    required : true,
    minlength : 1,
    unique : true,
    trim : true
  },
  account_type : {//(bank|postal)
    type : String,
    required : true,
    minlength : 1,
    trim : true
  },
  cif : {
    type : String,
    required : false,
    trim : true
  },
  ifsc : {
    type : String,
    required : false,
    minlength : 1,
    trim : true
  },
  branch : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  },
  threed_pin : {
    type : Number,
    required : false,
    minlength: 4
  },
  acc_mobile_no : {
    type : Number,
    required : false,
    minlength : 10,
    trim : true
  },
  acc_email_id : {
    type : String,
    required : false,
    trim : true,
    validate : {
      validator : validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },
  acc_secret_quest : {
    type : String,
    required : false,
    trim : true
  },
  acc_secret_quest_ans : {
    type : String,
    required : false,
    trim : true
  },
  atm_card_no : {
    type : Number,
    required : false,
    length : 16,
    trim : true
  },
  atm_pin : {
    type : Number,
    required : false,
    length : 16,
    trim : true
  },
  atm_valid_from : {
    type : String,
    required : false,
    trim : true
  },
  atm_valid_thru : {
    type : String,
    required : false,
    minlength : 1,
    trim : true
  },
  atm_name_on_card : {
    type : String,
    required : false,
    minlength : 1,
    trim : true
  },
  atm_cvv : {
    type : Number,
    required : false,
    minlength : 3,
    trim : true
  },
  atm_grids : {
    type : String,
    required : false,
    trim : true
  },
  inb_username : {
    type : String,
    required : false,
    minlength : 1,
    trim : true
  },
  inb_password : {
    type : String,
    required : false,
    minlength : 8,
    trim : true
  },
  inb_txn_password : {
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

module.exports={Bank};
