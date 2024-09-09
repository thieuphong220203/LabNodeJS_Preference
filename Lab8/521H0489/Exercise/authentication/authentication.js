const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    let authorization = req.header('Authorization')
    if( !authorization) return res.status(401).json({code:101, message: "Please enter json web token via header"})

    let token = authorization.split(' ')[1]
    if(!token) return res.status(401).json({code:101, message: "Please enter valid json web token"})
    const {JWT_SECRET} = process.env
    
    jwt.verify(token, JWT_SECRET, (error, data) => {
        if(error) return res.status(401).json({code:101, message:"Invalid token or expired"})
        req.user = data
        next()
    })
} 