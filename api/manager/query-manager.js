const mongoose = require('mongoose');

const Query = require('../models/query');

const UserManager = require('./user-manager');
const StatsManager = require('./stats-manager');
const TagManager = require('./tag-manager');

async function createQuery(query){
    //get or create user associated with query
    query.user = await UserManager.findOrCreateUserByJwt(query.user);
    //create empty stats
    query.stats = await StatsManager.newStats()
    //create query
    query = await Query.create(query).catch(err=>console.log(err))
    //check if query creation returned null
    if(query === null)
        return null
    //add query to tags
    await TagManager.addQueryToTags(query)
    //return query to controller
    return query
}

async function addResponseToQuery(response){
    await Query.updateOne({_id:response.query._id},{$push:{responses:response}})
}

async function viewQuery(queryId){
    return await Query.findOne(queryId)
}

async function updateStats(opinion,added){
    console.log(opinion.query+'needs stats update')
}

module.exports={createQuery,viewQuery,addResponseToQuery,updateStats}