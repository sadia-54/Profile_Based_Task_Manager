const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next)=>{
    const{authorization} = req.headers;
    try{
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const{Username, Email, User_Role} = decoded;
        req.Username = Username;
        req.Email = Email;
        req.User_Role = User_Role;
        next();
    } catch{
        next('Authentication Failed!');
    }
}

const isAdmin = (req, res, next)=>{
    if(req.user.User_Role!=='Admin'){
        return res.status(404).json({error: 'Authorization Failed!'});
    }
    next();
};


module.exports = {verifyToken, isAdmin};