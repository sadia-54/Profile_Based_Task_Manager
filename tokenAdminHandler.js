
const jwt = require('jsonwebtoken');
//  const connection = require('../config/db');


const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { Username, Email, User_Role } = decoded;
        
        req.Username = Username;
        req.Email = Email;
        req.User_Role = User_Role;
        next();
    } catch {
        next('Authentication Failure');
    }
}

// authMiddleware.js
const isAdmin = (req, res, next) => {
    if (req.user.User_Role !== 'Admin') {
        return res.status(403).json({ error: 'authorization failed !' });
    }
    next();
};


module.exports = { verifyToken, isAdmin };