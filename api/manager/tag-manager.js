const mongoose = require('mongoose');

const Tag = require('../models/tag');

async function addQueryToTags(query){
    //iterate through query tags
    query.tags.forEach(async (tag)=>{
        //find the query by word or create if not found and add this query to the list of queries
        await Tag.update(
            {_id:tag},
            {
                $push:{queries:query},
                $set:{_id:tag}
            },
            {upsert:true}
            )
    })
}

module.exports={addQueryToTags}