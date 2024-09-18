const mongo = require('mongoose')
module.exports = function dbconnection() {
    const url = process.env.MONGODB_URI;
    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('connectss');
    })
}


