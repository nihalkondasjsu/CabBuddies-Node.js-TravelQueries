const Query = require('../../models/query');
let router = require('express').Router();
const authToken = require('../../../utils/auth-token');
const ResponseManager = require('../../manager/response-manager');

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
    const { body,query } = req.body;
    console.log(req.body)
    const user = req.val
    
    const response = await ResponseManager.createResponse({
        query,
        body,
        user
    });

    console.log(response)

    res.send(response)
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
    let result = await Query.find({},'_id title body tags user.email')
    res.send(result)
})


module.exports = router