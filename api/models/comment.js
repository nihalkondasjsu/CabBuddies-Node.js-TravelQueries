const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message:{
        type:String,
        maxLength:[140,'Message is longer than 140 characters.']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postedOn:{ 
        type: Date, 
        default: Date.now 
    },
    query:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Query'
    },
    response:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Response'
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }
});

commentSchema.plugin(idvalidator)

commentSchema.pre('save',function(next){
    console.log('opinion pre save')
    if(hasOneReference(this))
        next();
    else
        next(new Error('invalid'));         
})

function hasOneReference(comment){
    let count = 0;
    if(comment.query!==undefined)
        count++
    if(comment.response!==undefined)
        count++
    if(comment.comment!==undefined)
        count++
    return count === 1
}

module.exports = mongoose.model('Comment',commentSchema);