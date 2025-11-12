const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, 
        process.env.ACCESS_TOKEN_KEY, 
        { expiresIn: '3m' });
}
const genrateRefreshToken = (payload) => {
    return jwt.sign(payload, 
        process.env.REFRESH_TOKEN_KEY, 
        { expiresIn: '15m' });
}
const decodeToken = (token, secretKey)=>{
    return jwt.verify(token, secretKey);
}


module.exports = {
    generateToken,
    genrateRefreshToken,
    decodeToken,
}