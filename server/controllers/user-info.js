const router = require('./../server');
var {User} = require('./../models/user');


var getAttrInfo = async (req, res)=>{
  console.log(JSON.stringify(req.body.queryResult.outputContexts[0], undefined, 2));
  var params = req.body.queryResult.outputContexts[0].parameters;
  const username = params.username;
  const attribute = params.secrets;

  res.setHeader('Content-Type', 'application/json');
  try{
    var users = await User.find({
      username : username.trim()
    });
    if(!users || users.length <= 0){
      console.log(users);
      res.send(JSON.stringify({
          "speech" : "Sorry, User doesn't exist!",
          "displayText" : "Sorry, User doesn't exist!"
      }));
    }else{
      console.log(users);
      var usrObj = JSON.parse(JSON.stringify(users[0].toObject()));
      res.send(JSON.stringify({
          "speech" : `${username}, your ${attribute} is ${usrObj[attribute]}`,
          "displayText" : `${username}, your ${attribute} is ${usrObj[attribute]}`
      }));
    }
  }catch(e){
    res.send(JSON.stringify({
        "speech" : "Error. Can you try it again ? ",
        "displayText" : "Error. Can you try it again ? "
    }));
  }
};

var addUser = (req, res)=>{
  console.log(req.body);
  var user = new User(req.body);

  user.save().then(() => {
    res.send(user);
  }).catch((e)=> {
    res.status(400).send(e);
  });
};
var getUserTest = (req, res)=>{
    res.send("Test success.");
};
module.exports = {
    getAttrInfo,
    addUser,
    getUserTest
}
