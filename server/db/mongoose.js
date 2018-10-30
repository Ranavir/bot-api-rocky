var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_BOT_API_ROCKY_URI);

module.exports={mongoose};
