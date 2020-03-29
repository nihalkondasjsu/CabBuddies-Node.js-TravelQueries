const mongoose = require('mongoose');

const Stats = require('../models/stats');

async function newStats(){
    return await Stats.create({})
}

async function getStats(statsId){
    return await Stats.findById(statsId)
}

async function reflectStatsByOpinion(statsId,opinion,added){

}

async function updateViews(statsId){
    await Stats.updateOne({_id:statsId},{$inc:{viewCount:1}})
}

async function updateUpVote(statsId,increase){
    let val = increase?1:-1
    await Stats.updateOne({_id:statsId},{$inc:{upVote:val,score:val}})
}

async function updateDownVote(statsId,increase){
    let val = increase?1:-1
    await Stats.updateOne({_id:statsId},{$inc:{downVote:val,score:val}})
}

async function updateFollowCount(statsId,increase){
    let val = increase?1:-1
    await Stats.updateOne({_id:statsId},{$inc:{followCount:val,score:val}})
}

async function updateSpamReportCount(statsId,increase){
    let val = increase?1:-1
    await Stats.updateOne({_id:statsId},{$inc:{spamReportCount:val,score:val}})
}

module.exports={newStats,getStats,updateViews,updateUpVote,updateDownVote,updateFollowCount,updateSpamReportCount}