const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        trim: true,
        lowercase: true,
        unique: true
    },
    firstName:{
        type:String,
        trim: true
    },
    lastName:{
        type:String,
        trim: true
    },
    phoneNumber:{
        type:String,
        trim: true,
        default:''
    }
});

userSchema.plugin(idvalidator)

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists.'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('User',userSchema);