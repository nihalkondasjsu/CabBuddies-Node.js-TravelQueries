const Query = require('../../models/query');
let router = require('express').Router();
const authToken = require('../../../utils/auth-token');
const QueryManager = require('../../manager/query-manager');

const Response = require('../../models/response');
const Tag = require('../../models/tag');

/*
POST with JSON body
{
    email:'email@domain.com',
    password:'strongpassword',
    firstName:'John',
    lastName:'Doe',
    phoneNumber:'9876543210'
}
*/
router.post('/create', authToken.authenticateToken ,async (req,res)=>{
    const { title, body, tags } = req.body;
    console.log(req.body)
    const user = req.val
    
    const query = await QueryManager.createQuery({
        title,
        body,
        tags,
        user
    });

    console.log(query)

    res.send(query)
})


/*
POST with JSON body
{
    email:'email@domain.com',
    password:'strongpassword'
}

returns
{
    accessToken:'ACCESS_TOKEN',
    refreshToken:'REFRESH_TOKEN'
}
*/
router.get('/read', async (req,res)=>{
    let results = await Query.find({})
    for(let i=0;i<results.length;i++){
        let proResult = {
            _id:results[i]._id,
            title:results[i].title,
            body:results[i].body,
            //tags:results[i].tags,
            tags:[],
            responses:[]
        };
        for(let j=0;j<results[i].tags.length;j++){
            console.log(results[i].tags[j])
            proResult.tags.push({
                word:(await Tag.findById(results[i].tags[j]._id)).word
            });
        }
        for(let j=0;j<results[i].responses.length;j++){
            console.log(results[i].responses[j])
            proResult.responses.push({
                body:(await Response.findById(results[i].responses[j]._id)).body
            });
        }
        results[i] = proResult;
    }
    res.send(results)
})


module.exports = router