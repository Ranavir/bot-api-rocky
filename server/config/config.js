var env = process.env.NODE_ENV || 'development';//which will be by default development if we are not running test & by default production when running in heroku

if(env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env];
  // console.log(Object.keys(envConfig));
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
