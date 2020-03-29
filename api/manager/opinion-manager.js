const mongoose = require('mongoose');

const Opinion = require('../models/opinion');

const QueryManager = require('./query-manager');

const ResponseManager = require('./response-manager');

/*

An opinion can influence a lot of stats
A new opinion of a user on a query/response is simple to handle
But a consequent opinion of a user on a query/response is a bit complicated
As it involves analyzing their previous opinions and decideding how to proceed

*/

async function saveOpinion(opinion){
    //returns false if the opinion is invalid 
    //(false is a flag denoting that this opinion is partial)
    if(invalidFormat(opinion,false))
        return false
    //building an example opinion based on user and (query or response)    
    let opinionExample = {user:opinion.user}

    if(opinion.query!==undefined){
        opinionExample.query=opinion.query
    }else{
        opinionExample.response=opinion.response
    }
    //getting a list of previous opinions user had about the same (query or response)
    let previousOpinions = await Opinion.find(opinionExample)

    //checking if previousOpinions has some documents
    if(previousOpinions!==null){
        //iterate through previous opinion
        for(let i=0;i<previousOpinions.length;i++){
            let prevOpinion = previousOpinions[i]
            /*
                Each of the users opinion about a query or a response are iterated and
                upon finding a same opinion the process of saving opinion is halted as
                the opinion was already stated before. In this case there is no chance
                to hit contradicting opinion with any of the other opinions in the list
                because that would mean the initial set of user opinions about a 
                query or a response had two opinions that contradict each other. The same
                way if we find a contradicting opinion there is no chance that there is
                some opinion in the set where it would be same as the new opinion. So
                a contradicting opinion is handled by removing/reverting the previous 
                contradicting opinion and allowing the new opinion to be preserved.
            */
            if(sameOpinion(prevOpinion,opinion)){
                return false
            }else if(contradictingOpinion(prevOpinion,opinion)){
                unregisterOpinion(prevOpinion)
                break
            }
        }

    }

    opinion = await registerOpinion(opinion)

    if(opinion === null)
        return null
    
    return opinion

}

/*
    returns false if opinion has a user and a opinionType and ( a query or response but not both )
*/
function invalidFormat(opinion,full){

    if(full === (opinion._id!==undefined))
        return true

    if(opinion.user===undefined)
        return true

    if(opinion.opinionType===undefined)
        return true

    let count = 0;
    if(opinion.query!==undefined)
        count++
    if(opinion.response!==undefined)
        count++
    if(count !== 1)
        return true
    
}

/*
checks for equality in opinionTypes
*/
function sameOpinion(prevOpinion,opinion){
    return opinion.opinionType===prevOpinion.opinionType
}

/*
checks for contradicting nature in opinions
*/
function contradictingOpinion(prevOpinion,opinion){
    return (prevOpinion.opinionType==='UpVote' && opinion.opinionType==='DownVote')
            ||
            (prevOpinion.opinionType==='DownVote' && opinion.opinionType==='UpVote')
}

/*
    Upon calling this function we assume that all checks have been made on the opinion
    so insert opinion and update stats accordingly
    and returns inserted opinion
*/
async function registerOpinion(opinion){
    //push opinion into database
    opinion = await Opinion.create(opinion).catch((err)=>console.log(err))
    //return null if yes insert resulted in null
    if(opinion===null)
        return null
    
    reportForStatsUpdate(opinion,true)

    return opinion
}

/*
    Upon calling this function we assume that all checks have been made on the opinion
    (a clean opinion is fetched from the db based on user request)
    function removes the opinion and update stats accordingly
*/
async function unregisterOpinion(opinion){
    await Opinion.deleteOne({_id:opinion._id})
    //REQUIRES A CHECK FOR THE RESULT OF ABOVE OPERATION
    reportForStatsUpdate(opinion,false)
}

async function reportForStatsUpdate(opinion,added){
    if(opinion.query!==undefined){
        QueryManager.updateStats(opinion,added)
    }else{
        ResponseManager.updateStats(opinion,added)
    }
}

/*
    user chooses to take back the opinion
    so perform validation check on opinion and call unregisterOpinion
*/
async function revertOpinion(opinion){
    //returns false if the opinion is invalid 
    //(true is a flag denoting that this opinion is full i.e. has id)
    if(invalidFormat(opinion,true))
        return false
    opinion = Opinion.findById(opinion._id)    
    return await unregisterOpinion(opinion)
}

module.exports={saveOpinion,revertOpinion}