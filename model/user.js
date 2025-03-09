const mongoose = require('mongoose');
const becrypt = require('bcryptjs');


const userShema = new mongoose.Schema({
    name:String,
    email:{required:true, unique:true, type:String},
    age:Number,
    password:String
});

userShema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await becrypt.hash(this.password, 10);
    }
    next();
});

userShema.methods.comparePassword = async function(password){
  
    return await becrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userShema);