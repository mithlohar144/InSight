const jwt = require('jsonwebtoken')
async function identifyCheck(req, res, next){
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "UnAuthorized Access,"
        })
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            message: "UnAuthorized Access, "
        })
    }
    req.user = decoded;
    next()
}

module.exports = identifyCheck;