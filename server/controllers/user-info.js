const router = require('./../server');
var {User} = require('./../models/user');


var getAdharInfo = (req, res)=>{
  console.log(req.body);
  User.find({
    username : req.body.username.trim()
  }).then((users)=>{
    res.send({
      adharId: users[0].adhar
    });
  }, (err)=>{
    res.status(400).send(e);
  });
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
    getAdharInfo,
    addUser
}
