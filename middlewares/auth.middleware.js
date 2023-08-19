
const { BlacklistModel } = require("../models/blacklistModel")
const jwt= require("jsonwebtoken")

const authMiddleware = async (req,res,next)=>{
    //get token 
    //const token = req.cookies?.token
    const token = req.headers?.authorization?.split(" ")[1]
    //check blacklist 
    try {
        if(!token){
            res.status(401).send({"error":"please login"})
            return
        }
        const isToken = await BlacklistModel.findOne({"ex_token":token})
        if(isToken){
            res.status(401).send({"error":"please login again"})
        }else{
            jwt.verify(token, 'masai', (err, decoded) =>{
               if(err){
                if(err.expiredAt){
                    res.status(401).send({"error":"token expired"})
                }else{
                    res.status(500).send({"error":"internal server error"})
                }
               }else if(!decoded){
                res.status(401).send({"msg":"invalid token"})
               }else if(decoded){
                req.body.userID=decoded.userID
                req.body.username=decoded.username

                 next()
               }
              });
        }
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
    
    
}

module.exports ={authMiddleware}