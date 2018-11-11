const router = require('./../server');
var {User} = require('./../models/user');
var {Bank} = require('./../models/bank');
var {CreditCard} = require('./../models/creditcard');
var {Email} = require('./../models/email');
var {spoofEmail} = require('./../utils/mailutils');

var getUser = async (req, res)=>{
  // console.log("Request Body: ");
  // console.log(JSON.stringify(req.body, undefined, 2));

  //find out the intent
  var intent = req.body.queryResult.intent.displayName;
  var params = req.body.queryResult.outputContexts[0].parameters;
  let fulfillmentText;
  switch(intent){
    case "my-secret-details":
      fulfillmentText = await secretDetails(params);
      break;
    case "my-bank-details":
      fulfillmentText = await bankDetails(params);
      break;
    case "my-credit-card-details":
      fulfillmentText = await creditCardDetails(params);
      break;
    case "my-email-details":
      fulfillmentText = await emailDetails(params);
      break;
    case "email-spoof":
      fulfillmentText = await emailSpoof(params);
      break;
    default:
      fulfillmentText = "Error. Can you try it again ?";
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({fulfillmentText}));


};

//my-secret-details
var secretDetails = async (params)=>{
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
  try{
    const user = await User.findByCredentials(username.trim(), password.trim());
    if(!user){
      return "Sorry, User doesn't exist!";
    }else{
      console.log(`User found with ID: ${user._id}`);
      // var usrObj = JSON.parse(JSON.stringify(user.toObject()));
      console.log(`Requested Secret retrieved as : ${user[attribute]}`);
      if(user[attribute]){
        return `${username}, your ${attrOriginal} is ${user[attribute]}`;
      }else{
        return `Sorry, ${username}, ${attribute} Cannot Not be found.`;
      }

    }
  }catch(e){
    return "Error. Can you try it again ?";
  }
};//end of my-secret-details

//my-bank-details
var bankDetails = async (params)=>{
  const username = params.username;
  const password = params.password;
  let attribute;
  let attrOriginal;
  let bankName;
  Object.keys(params).forEach(function(key) {
    if(key === 'bank-secret'){
      attribute = params[key];
    }
    if(key === 'bank-secret.original'){
      attrOriginal = params[key];
    }
    if(key === 'bank-name'){
      bankName = params[key];
    }
  });
  console.log(`User : ${username} with Password : ${password} requested for Secret : ${attribute}`);
  try{
    const user = await User.findByCredentials(username.trim(), password.trim());
    if(!user){
      return "Sorry, User doesn't exist!";
    }else{
      console.log(`User found with ID: ${user._id}`);

      var bankObj = await Bank.findOne({
  	    bank_name : bankName,
  	    _user : user._id
  	  });

      // var usrObj = JSON.parse(JSON.stringify(user.toObject()));
      console.log(`Requested Secret retrieved as : ${bankObj[attribute]}`);
      if(bankObj[attribute]){
        return `${username}, your ${bankName} ${attrOriginal} is ${bankObj[attribute]}`;
      }else{
        return `Sorry, ${attrOriginal} for bank ${bankName}Cannot Not be found.`;
      }

    }
  }catch(e){
    return "Error. Can you try it again ?";
  }
};//end of my-bank-details


//my-credit-card-details
var creditCardDetails = async (params)=>{
  const username = params.username;
  const password = params.password;
  let attribute;
  let attrOriginal;
  let bankName;
  Object.keys(params).forEach(function(key) {
    if(key === 'credit-card-secret'){
      attribute = params[key];
    }
    if(key === 'credit-card-secret.original'){
      attrOriginal = params[key];
    }
    if(key === 'bank-name'){
      bankName = params[key];
    }
  });
  console.log(`User : ${username} with Password : ${password} requested for Secret : ${attribute}`);
  try{
    const user = await User.findByCredentials(username.trim(), password.trim());
    if(!user){
      return "Sorry, User doesn't exist!";
    }else{
      console.log(`User found with ID: ${user._id}`);

      console.log('Hello what happened...');
      var ccObj = await CreditCard.findOne({
  	    cc_bank_name : bankName,
  	    _user : user._id
  	  });
      console.log('Hello ...');
      // var usrObj = JSON.parse(JSON.stringify(user.toObject()));
      console.log(`Requested Secret retrieved as : ${ccObj[attribute]}`);
      if(ccObj[attribute]){
        return `${username}, your ${bankName} ${attrOriginal} is ${ccObj[attribute]}`;
      }else{
        return `Sorry, ${attrOriginal} for bank ${bankName}Cannot Not be found.`;
      }

    }
  }catch(e){
    return "Error. Can you try it again ?";
  }
};//end of my-bank-details

//my-email-details
var emailDetails = async (params)=>{
  const username = params.username;
  const password = params.password;
  let attribute;
  let attrOriginal;
  let emailProvider;
  Object.keys(params).forEach(function(key) {
    if(key === 'email-provider'){
      emailProvider = params[key];
      attribute = params[key];
    }
    if(key === 'email-provider.original'){
      attrOriginal = params[key];
    }
  });
  console.log(`User : ${username} with Password : ${password} requested for Secret : ${attribute}`);
  try{
    const user = await User.findByCredentials(username.trim(), password.trim());
    if(!user){
      return "Sorry, User doesn't exist!";
    }else{
      console.log(`User found with ID: ${user._id}`);

      var emails = await Email.find({
  	    email_provider : emailProvider,
  	    _user : user._id
  	  });


      if(emails && emails.length > 0){
        // var info = JSON.stringify(emails,undefined,2);
        let info = "";
        emails.forEach((email)=>{
          info += `[Email id : ${email.email_id} & Password : ${email.email_password}] `
        });
        console.log(`Requested Secret retrieved as : ${info.trim()}`);
        return `${username}, your ${attrOriginal} details are as follows:  ${info.trim()}`;
      }else{
        return `Sorry, ${attrOriginal} for bank ${bankName}Cannot Not be found.`;
      }

    }
  }catch(e){
    return "Error. Can you try it again ?";
  }
};//end of my-email-details

//email-spoof
var emailSpoof = async (params)=>{
  const username = params.username;
  const password = params.password;
  let to,from,subject,text,html;
  Object.keys(params).forEach(function(key) {
    if(key === 'to_email'){
      to = params[key];
    }
    if(key === 'from_email'){
      from = params[key];
    }
    if(key === 'email_subject'){
      subject = params[key];
    }
    if(key === 'email_text'){
      text = params[key];
      html = `<strong>${text}</strong>`;
    }
  });
  const msg = {to,from,subject,text,html};
  console.log(JSON.stringify(msg, undefined, 2));
  console.log(`User : ${username} with Password : ${password} requested for spoof email.`);
  try{
    const user = await User.findByCredentials(username.trim(), password.trim());
    if(!user){
      return "Sorry, User doesn't exist!";
    }else{
      console.log(`User found with ID: ${user._id}`);

      var fulfillmentText = await spoofEmail(msg);

      return fulfillmentText;
    }
  }catch(e){
    return "Error. Can you try it again ?";
  }
};//end of email-spoof



//addUser
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
