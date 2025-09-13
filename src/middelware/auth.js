const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Owner = require('../models/owner');

const adminAuth = async (req,res,next)=>{
    try{
        const {token}  = req.cookies;
        if(!token){
            throw new Error("THe user is not Authorized");
        }
        const decodedString = jwt.verify(token,"plugpoint");
        const {_id}  = decodedString;

        if (!_id){
            throw new Error("User not found recheck email, password");
        }

        const user = Owner.findById(_id);
        // createa new key user
        req.user = user;
        next();
    }catch(e){
        res.json({"message":"someting wants wrong in Owner auterization","error": e.message})
    }
}

const userAuth = async (req, res, next)=>{
    try{
        const {token}  = req.cookies;
        if(!token){
            throw new Error("THe user is not Authorized");
        }
        const decodedString = jwt.verify(token,"plugpoint");
        const {_id}  = decodedString;

        if (!_id){
            throw new Error("User not found recheck email, password");
        }

        const user = User.findById(_id);
        // createa new key user
        req.user = user;
        next();
    }catch(e){
        res.json({"message":"someting wants wrong in user auterization","error": e.message})
    }
}


module.export = {userAuth, adminAuth};