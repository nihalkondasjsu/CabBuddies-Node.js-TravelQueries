const restClient = require('./rest-client');

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)

    req.val = await restClient.validateJwt(authHeader)

    next()
}

module.exports={authenticateToken}
