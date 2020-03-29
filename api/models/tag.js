const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const tagSchema = mongoose.Schema({
    _id:{
        type:String,
        minLength:2,
        maxLength:64
    },
    queries:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Query'
    }],
    count:{
        type:Number,
        default:0
    }
});

tagSchema.plugin(idvalidator)

module.exports = mongoose.model('Tag',tagSchema);