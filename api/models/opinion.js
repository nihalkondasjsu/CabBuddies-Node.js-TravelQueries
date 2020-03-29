const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const opinionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message:{
        type:String,
        maxLength:[140,'Message is longer than 140 characters.']
    },
    opinionType:{
        type: String,
        enum: ['Follow', 'UpVote','DownVote','SpamReport']
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
    }
});

opinionSchema.plugin(idvalidator)

opinionSchema.index({ opinionType: 1, user: 1, query:1 }, { unique: true })
opinionSchema.index({ opinionType: 1, user: 1, response:1 }, { unique: true })

opinionSchema.pre('save',function(next){
    console.log('opinion pre save')
    if(hasOneReference(this))
        next();
    else
        next(new Error('invalid'));        
})

function hasOneReference(opinion){
    let count = 0;
    if(opinion.query!==undefined)
        count++
    if(opinion.response!==undefined)
        count++
    return count === 1
}

module.exports = mongoose.model('Opinion',opinionSchema);