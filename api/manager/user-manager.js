const mongoose = require('mongoose');

const User = require('../models/user');

async function findOrCreateUserByJwt(user){
    //trying to find tq_user based on userId in jwt
    let resuser = await User.findOne({userId:user.userId});
    //creating tq_user if above statement resulted in null
    if(resuser == null){
        //return a newly created user
        return await User.create(user).catch(err=>console.log(err));
    }
    //return found user
    return resuser
}

module.exports={findOrCreateUserByJwt}