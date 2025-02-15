const mongoose = require('mongoose');
async function connectMongodb(MONGOURL){
    return mongoose.connect(MONGOURL)
    .then(()=>{
        console.log('Database Connection Established');
    })
    .catch(err=>{
        console.log("Connection Error: ",err);
    })
}

module.exports = {connectMongodb,};