const basicAuth = require('express-basic-auth');

var bAuth = basicAuth({
    users: { 'admin': 'supersecret' }
});

module.exports = {bAuth};
