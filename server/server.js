//import configurations
require('./config/config')

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
// const basicAuth = require('express-basic-auth');
var {bAuth} = require('./middleware/basicauth')

const {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');

var app = express();
const port = process.env.PORT || 3000;
//https://stackoverflow.com/questions/35749288/separate-file-for-routes-in-express/35749744
var router = express.Router();

var userCtrl = require('./controllers/user-info');

//use below express middleware statement to parse the request body aloways to a json
app.use(bodyParser.json());
app.use((req, res,next)=>{
		var now = new Date().toString();

		console.log(`${now} : ${req.method} ${req.url}`);//logger
		next();
	}
);

router.route('/user/getAdharInfo').post(bAuth, userCtrl.getAdharInfo);
router.route('/user/addUser').post(bAuth, userCtrl.addUser);

app.listen(port, () => {
  console.log(`App started up at port : ${port}`);
});

app.use('/botapi', router);
module.exports = {router};
