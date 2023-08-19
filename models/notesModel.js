const mongoose = require("mongoose")
const notesSchema = mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    date:{type:String,required:true},
    username:{type:String,required:true},
    userID:{type:String,required:true}
})

const NotesModel = mongoose.model("allnote",notesSchema)
module.exports = {NotesModel}