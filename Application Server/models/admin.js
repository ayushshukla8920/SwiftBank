const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
})

adminSchema.pre('save',async function(next){
    const admin = this;
    if(!admin.isModified('password')){
        next();
    }
    try{
        const hash_password = await bcrypt.hash(admin.password, salt);
        admin.password = hash_password;
    }catch(error){
        next(error);
    }
})

const admin = mongoose.model('admin',adminSchema);

module.exports = admin;