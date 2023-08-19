const express = require("express")
const { NotesModel } = require("../models/notesModel")
const { authMiddleware } = require("../middlewares/auth.middleware")



const notesRouter = express.Router()

//read
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your frontend origin
    res.setHeader("Access-Control-Allow-Credentials", "true");
    // Other headers setup
    next();
  });
  
notesRouter.get("/",authMiddleware, async (req,res)=>{
    try {
        const notes = await NotesModel.find({"userID":req.body.userID})
        res.send(notes)
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})

//create 
notesRouter.post("/addnote",authMiddleware, async (req,res)=>{
    try {
        const noteToAdd= new NotesModel(req.body)
        await noteToAdd.save()
        res.send({"msg":"note added"})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
        console.log(error)
    }
})
//update

notesRouter.patch("/updatenote/:id",authMiddleware,async (req,res)=>{
    const {id}=req.params
    // console.log(id)
    try {
        const note = await NotesModel.findOne({_id:id})
        if(note.userID==req.body.userID){
            await NotesModel.findByIdAndUpdate({_id:id},req.body)
            res.send({"msg":"note updated"})
        }else{
            res.status(401).send({"error":"you are not authorized."})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({"error":"internal server error"})
    }
})

//delete

notesRouter.delete("/deletenote/:id",authMiddleware, async (req,res)=>{
    const {id}=req.params
    try {
        const note = await NotesModel.findOne({_id:id})
        if(note.userID==req.body.userID){
            await NotesModel.findByIdAndDelete({_id:id})
            res.send({"msg":"note deleted"})
        }else{
            res.status(401).send({"error":"you are not authorized."})
        }
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})


module.exports = {notesRouter}