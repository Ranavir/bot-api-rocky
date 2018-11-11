var crypto = require('crypto');

var encrypt = function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc', process.env.SERVER_SECRET);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

var decrypt = function decrypt(text){
  if (text === null || typeof text === 'undefined') {return text;};
  var decipher = crypto.createDecipher('aes-256-cbc', process.env.SERVER_SECRET);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

// const civ = new Buffer(crypto.randomBytes(16), 'utf8');
//
// var encrypt = function encrypt(text){
//   var cipher = crypto.createCipheriv('aes-256-cbc', process.env.SERVER_SECRET, process.env.IV);
//   var crypted = cipher.update(text,'utf8','hex');
//   crypted += cipher.final('hex');
//   return crypted;
// }
//
// var decrypt = function decrypt(text){
//   if (text === null || typeof text === 'undefined') {return text;};
//   var decipher = crypto.createDecipheriv('aes-256-cbc', process.env.SERVER_SECRET, process.env.IV);
//   var dec = decipher.update(text,'hex','utf8');
//   dec += decipher.final('utf8');
//   return dec;
// }

module.exports= {
  encrypt,
  decrypt
};
