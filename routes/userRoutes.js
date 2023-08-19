const express = require("express");
const jwt=require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { UserModel } = require("../models/userModel");
const { loginMiddleware } = require("../middlewares/login.middleware");
const { BlacklistModel } = require("../models/blacklistModel");

const userRouter = express.Router()

userRouter.post("/register",async (req,res)=>{
    //pass word check
    //email check 
    const {email,password,username}=req.body

    try {
        //email
       const checkEmail= await UserModel.findOne({email})
       if(checkEmail){
        res.status(401).send({"error":"email already exists"})
       }else{
        bcrypt.hash(password, 5, async (err, hash)=> {
            if(err){
                res.status(500).send({"error":"internal server error"})
                //console.log(err)
            }else if(!hash){
                res.status(500).send({"error":"internal server error"})
            }else{
                const newUser = new UserModel({email,password:hash,username})
                await newUser.save()
                res.send({"msg":"added new user"})
            }
        });
    }
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
       // console.log(error)
    }
   
})

userRouter.post("/login",loginMiddleware, async (req,res)=>{
    try {
        const user = await UserModel.findOne({"email":req.body.email})

        const token = jwt.sign({ userID: user._id,username:user.username }, "masai",{ expiresIn: '1h' })
        const refreshToken=jwt.sign({ userID: user._id,username:user.username }, "school",{ expiresIn: '7d' })
        res.send({"msg":"user logged in", "token":token ,"rtoken":refreshToken,"username":user.username})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})

userRouter.get("/logout",async (req,res)=>{
    const token = req.headers?.authorization?.split(" ")[1]
    try {
        const tokenToAdd= new BlacklistModel({"ex_token":token})
        await tokenToAdd.save()
        res.send({"msg":"user logged out"})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})

module.exports = {userRouter}