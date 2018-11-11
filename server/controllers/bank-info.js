const router = require('./../server');
var {User} = require('./../models/user');
var {Bank} = require('./../models/bank');



var addBankDetails = async (req, res)=>{
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
    var newBankDetails = new Bank({
      bank_name : req.body.bank_name,
      account_no : req.body.account_no,
      account_type : req.body.account_type,
      cif : req.body.cif,
      ifsc : req.body.ifsc,
      branch : req.body.branch,
      threed_pin : req.body.threed_pin,
      acc_mobile_no : req.body.acc_mobile_no,
      acc_email_id : req.body.acc_email_id,
      acc_secret_quest : req.body.acc_secret_quest,
      acc_secret_quest_ans : req.body.acc_secret_quest_ans,
      atm_card_no : req.body.atm_card_no,
      atm_pin : req.body.atm_pin,
      atm_valid_from : req.body.atm_valid_from,
      atm_valid_thru : req.body.atm_valid_thru,
      atm_name_on_card : req.body.atm_name_on_card,
      atm_cvv : req.body.atm_cvv,
      atm_grids : req.body.atm_grids,
      inb_username : req.body.inb_username,
      inb_password : req.body.inb_password,
      inb_txn_password : req.body.inb_txn_password,
      _user : user._id
    });
    var bankDetails = await newBankDetails.save();
    res.send({bankDetails});
  }catch(err){
    res.status(400).send(err);
  }

};

module.exports = {
    addBankDetails
}
