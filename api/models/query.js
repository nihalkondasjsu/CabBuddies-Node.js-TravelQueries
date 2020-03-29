const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const querySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title:{
        type:String,
        minLength:5,
        maxLength:140
    },
    body:{
        type:String,
        maxLength:500
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    tags:[{
        type:String,
        minLength:2,
        maxLength:64
    }],
    responses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Response'
    }],
    stats:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stats'
    },

    postedOn:{ 
        type: Date, 
        default: Date.now 
    },
    lastUpdatedOn:{ 
        type: Date, 
        default: Date.now 
    },
    active:{
        type:Boolean,
        default:false
    }
});

querySchema.plugin(idvalidator)

querySchema.index({ 'stats.score': 1,'stats.viewCount': 1 })
querySchema.index({ 'postedOn': 1,'stats.score': 1 })

module.exports = mongoose.model('Query',querySchema);