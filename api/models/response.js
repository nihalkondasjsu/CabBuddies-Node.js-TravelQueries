const mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

const responseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    body:{
        type:String,
        minLength:1,
        maxLength:500
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    query:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Query'
    },
    stats:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stats'
    },
    hidden:{
        type:Boolean,
        default:false
    },

    postedOn:{ 
        type: Date, 
        default: Date.now 
    },
    lastUpdatedOn:{ 
        type: Date, 
        default: Date.now 
    },
    accepted:{
        type:Boolean,
        default:false
    }
});

responseSchema.plugin(idvalidator)

responseSchema.index({ query: 1, hidden: 1, accepted: 1, 'stats.score': 1,'stats.viewCount': 1 })

module.exports = mongoose.model('Response',responseSchema);