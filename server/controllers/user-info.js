const router = require('./../server');
var {User} = require('./../models/user');


var getUser = async (req, res)=>{
  // console.log("Request Body: ");
  // console.log(JSON.stringify(req.body, undefined, 2));
  var params = req.body.queryResult.outputContexts[0].parameters;
  const username = params.username;
  const password = params.password;
  const attribute = params.secrets;
  console.log(`User : ${username} with Password : ${password} requested for Secret : ${attribute}`);
  let attrOriginal;
  Object.keys(params).forEach(function(key) {
    if(key === 'secrets.original'){
      attrOriginal = params[key];
      return;
    }
  });
  const strAttrOriginal = '';
  res.setHeader('Content-Type', 'application/json');
  try{
    const user = await User.findByCredentials(username.trim(), password.trim());
    if(!user){
      res.send(JSON.stringify({
          "fulfillmentText" : "Sorry, User doesn't exist!",
      }));
    }else{
      console.log(`User found with ID: ${user._id}`);
      var usrObj = JSON.parse(JSON.stringify(user.toObject()));
      console.log(`Requested Secret retrieved as : ${usrObj[attribute]}`);
      if(usrObj[attribute]){
        res.send(JSON.stringify({
            "fulfillmentText" : `${username}, your ${attrOriginal} is ${usrObj[attribute]}`,
        }));
      }else{
        res.send(JSON.stringify({
            "fulfillmentText" : `Sorry, ${username}, ${attribute} Cannot Not be found.`,
        }));
      }

    }
  }catch(e){
    res.send(JSON.stringify({
        "fulfillmentText" : "Error. Can you try it again ? ",
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

module.exports = {
    getUser,
    addUser
}
