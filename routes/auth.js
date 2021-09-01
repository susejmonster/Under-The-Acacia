const jwt = require('jsonwebtoken');

module.exports = function auth(req,res,next){

    const token = req.cookie('authtoken');
    if(!token) res.status(401).send('token isnt coming');


    try{
        jwt.verify(token,'nandini');
        console.log("allowed")
        next();
    }
    catch(ex){
        res.status(400).send('invalid token');
    }
}

