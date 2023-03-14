var jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtKey = process.env.JWTKEY;

const verifyToken = (req, res, next) => {
    const jwtToken = req.header('auth-token');
    if (!jwtToken) {
        res.status(401).json({
            id: 5,
            statusCode: 401,
            type: 'error',
            message: 'Please validate using a valid token'
        })
    } else {
        try {
            const data = jwt.verify(jwtToken, jwtKey);
            req.credentials = data.credentials;
            next();
        } catch (error) {
            res.status(401).json({
                id: 5,
                statusCode: 401,
                type: 'error',
                message: 'Please validate using a valid token'
            })
        }
    }
}

module.exports = verifyToken;