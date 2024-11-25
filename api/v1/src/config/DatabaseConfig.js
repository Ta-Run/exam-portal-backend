const mongo = require('mongoose')
module.exports = function dbconnection() {
    const url = process.env.MONGODB_URI;
    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 10000, // 10 seconds
        socketTimeoutMS: 45000,  // 45 seconds
    }).then(() => {
        console.log('connectss');
    })
}


