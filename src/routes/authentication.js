const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require("validator");
const cookieParser = require('cookie-parser');
const User = require('../models/user');
const Owner = require("../models/owner");


const authRouter = express.Router();
authRouter.use(express.json());
authRouter.use(cookieParser());

// user/signup
authRouter.post('/user/signup', async (req, res)=>{
    try{
        const {firstName, lastName, email, password, phone, vehicle, company} = req.body;
        // add the sanatisation of data
        hashing = await bcrypt.hash(password,10);
        console.log("the hash string is ", hashing);
        let user = email.replace("@gmail.com","")
        let userdata = new User({
            firstName: firstName,
            lastName:lastName,
            user : user,
            email:email,
            password:hashing,
            phone:phone,
            vehicle:vehicle,
            company:company
        });
        await userdata.save();
        console.log("data is save ", userdata);
        res.status(200).json({"message":"responce has been saved"});
    }catch (e){
        console.log(e.message);
        res.status(500).json({"message":"somthing wants wrong in user data signup service"});
    }
})

authRouter.post("/user/login",async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});

        if(!user){
            throw new Error("Use is not found");
        }
        let isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            throw new Error("User is not authorized check your password and email");
        }

        const token  = await jwt.sign({_id: user._id}, "powerplug");
        res.cookie("token", token, {
            expires: new Date(Date.now() + 60*60*1000),
            httpOnly:true
        });

        res.status(200).json({
            "message":"you are login sucessfully"
        });

    }catch{
        res.status(500).json({
            "message":"check your password and email"
        })
    }
})


module.exports = authRouter;

