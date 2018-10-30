//import configurations
require('./config/config')

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate')
var app = express();
const port = process.env.PORT || 3000;

//use below express middleware statement to parse the request body aloways to a json
app.use(bodyParser.json());
app.use((req, res,next)=>{
		var now = new Date().toString();

		console.log(`${now} : ${req.method} ${req.url}`);//logger
		next();
	}
);



//User Post URI
app.post('/users', async (req, res) => {
	try{
		const body = _.pick(req.body, ['email', 'password']);
	  const user = new User(body);
		await user.save();
		var token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	}catch(e){
		res.status(400).send(e);
	}
});

app.get('/users/me',authenticate,(req, res) =>{
  res.send(req.user);
});
app.get('/users',(req, res)=>{
  User.find().then((users)=>{

    // users = _.map(users, function(user) {
    //   return _.pick(user, ['email', 'password']);
    // });
    res.send({
      users,
      status : 'OK'
    });
  }, (err)=>{
    res.status(400).send(e);
  });
});

//login
app.post('/users/login', async (req, res) => {
  try{
		const body = _.pick(req.body, ['email', 'password']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	}catch(err){
		res.status(400).send();
	}
});



app.delete('/users/me/token', authenticate, async (req, res) => {
	try{
		await req.user.removeToken(req.token);
		res.status(200).send();
	}catch(err){
		res.status(400).send();
	}
});

app.listen(port, () => {
  console.log(`App started up at port : ${port}`);
});
