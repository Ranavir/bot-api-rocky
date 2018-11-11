const router = require('./../server');
var {User} = require('./../models/user');
var {Email} = require('./../models/email');



var addEmail = async (req, res)=>{
  console.log(req.body);
  try{
    //find user by username
    var user = await User.findOne({
      username : req.body.username
    });
    console.log(`User : ${user._id}`);

    if(!user){
      res.status(401).send();
    }
    //add bank details for this user
    var newEmail = new Email({
      email_provider : req.body.email_provider,
      email_id : req.body.email_id,
      email_password : req.body.email_password,
      _user : user._id
    });
    var email = await newEmail.save();
    res.send({email});
  }catch(err){
    res.status(400).send(err);
  }

};

module.exports = {
    addEmail
}
