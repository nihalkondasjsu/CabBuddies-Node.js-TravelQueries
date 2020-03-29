const mongoose = require('mongoose');

const Response = require('../models/response');

const UserManager = require('./user-manager');
const StatsManager = require('./stats-manager');
const QueryManager = require('./query-manager');

async function createResponse(response){
    //get or create user associated with response
    response.user = await UserManager.findOrCreateUserByJwt(response.user);
    //create empty stats
    response.stats = await StatsManager.newStats()
    //create response
    response = await Response.create(response).catch(err=>console.log(err))
    //return null if response is null
    if(response==null)
        return null
    //add response to query
    await QueryManager.addResponseToQuery(response)
    //return response
    return response
}

async function viewResponse(responseId){
    return await Response.findById(responseId)
}

async function updateStats(opinion,added){
    console.log(opinion.response+'needs stats update')

}

module.exports={createResponse,viewResponse,updateStats}