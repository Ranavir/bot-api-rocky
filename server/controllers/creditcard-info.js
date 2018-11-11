const router = require('./../server');
var {User} = require('./../models/user');
var {CreditCard} = require('./../models/creditcard');



var addCreditCardDetails = async (req, res)=>{
  console.log(req.body);
  try{
    //find user by username
    var user = await User.findOne({
      username : req.body.username
    });
    console.log(`User : ${user._id}`);

    if(!user){
      console.log("hey throw me...");
      res.status(401).send();
    }
    //add bank details for this user
    var newCreditCardDetails = new CreditCard({
      cc_bank_name : req.body.cc_bank_name,
      cc_card_no : req.body.cc_card_no,
      cc_type : req.body.cc_type,
      cc_pin : req.body.cc_pin,
      cc_mobile_no : req.body.cc_mobile_no,
      cc_mobile_no : req.body.cc_mobile_no,
      cc_email_id : req.body.cc_email_id,
      cc_valid_from : req.body.cc_valid_from,
      cc_valid_thru : req.body.cc_valid_thru,
      cc_cvv : req.body.cc_cvv,
      cc_name_on_card : req.body.cc_name_on_card,
      cc_inb_username : req.body.cc_inb_username,
      cc_inb_password : req.body.cc_inb_password,
      _user : user._id
    });
    var ccDetails = await newCreditCardDetails.save();
    res.send({ccDetails});
  }catch(err){
    res.status(400).send(err);
  }

};

module.exports = {
    addCreditCardDetails
}
