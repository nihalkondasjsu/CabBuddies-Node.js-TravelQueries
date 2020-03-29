var Client = require('node-rest-client').Client;
 
var client = new Client();

function validateJwtExt(jwt) {
    return new Promise(resolve => {
        let headers = {  
            "Content-Type": "application/json",
            "Authorization": jwt
          }
          let httpArgs = {  
            "headers": headers
          }
        let args = {
            headers
        };
         
        client.get("http://localhost:3000/jwt/decode", args,(data,response)=>{
            resolve(data)
        });
    })
 }

module.exports={
    validateJwt:async function(jwt){
        return await validateJwtExt(jwt)
    }
}