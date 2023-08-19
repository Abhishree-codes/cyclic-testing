const express = require("express")
const { connection } = require("./db")
const { userRouter } = require("./routes/userRoutes")
const jwt = require("jsonwebtoken")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { notesRouter } = require("./routes/notesRoutes")
//env
//cookies
//status codes
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
    exposedHeaders: ['X-Custom-Header']
}))
app.use(cookieParser())
app.use("/users",userRouter)
app.use("/notes",notesRouter)
app.get("/",(req,res)=>{
    res.send("home page")
})

app.get("/regentoken",(req,res)=>{
    const rtoken = req.cookies.rtoken
    jwt.verify(rtoken, 'school', (err, decoded)=> {
        if(err){
            if(err.expiredAt){
                res.status(401).send({"error":"token expired"})
            }else{
                res.status(500).send({"error":"internal server error"})
            }
        }else if(!decoded){
            res.status(401).send({"msg":"invalid refresh token"})
        }else if(decoded){
            const token = jwt.sign({ userID: decoded.userID,username:decoded.username }, "masai",{ expiresIn: '1h' })
            res.send({"regeneratedtoken":token})
        }
      });
      
})
app.listen(8080,async()=>{
    try {
        await connection
        console.log("connected and running")
    } catch (error) {
        console.log(error)
    }
})