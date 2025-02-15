const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dateOfBirth:{
        type: String,
        required: true,
    },
    mobNo: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender:{
        type: String,
        required: true,
    },
    kycDone: {
        type: Boolean,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    }
});

userSchema.pre('save',async function(next){
    const user = this;
    if(!user.isModified('password')){
        next();
    }
    try{
        const hash_password = await bcrypt.hash(user.password, salt);
        user.password = hash_password;
    }catch(error){
        next(error);
    }
})

const user = mongoose.model('user',userSchema);

module.exports = user;