const { UserModel } = require("../models/userModel")
const bcrypt=require("bcrypt")

loginMiddleware= async (req,res,next)=>{
   const {email,password}= req.body
   try {
    const user = await UserModel.findOne({"email":email})
    if(email){
        bcrypt.compare(password, user.password, (err, result)=> {
            if(err){
                res.status(500).send({"error":"internal server error"})
            }else if(!result){
                res.status(401).send({"error":"invalid credentials"})
            }else if(result){
              next()  
            }
        });
    }else{
        res.status(401).send({"error":"user does not exist"})
    }
   } catch (error) {
    res.status(500).send({"error":"internal server error"})
   }
}

module.exports={loginMiddleware}