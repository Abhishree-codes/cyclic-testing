const mongoose = require("mongoose")
const blackistSchema = mongoose.Schema({
    ex_token:{type:String,required:true}
})

const BlacklistModel = mongoose.model("blacklistedtoken",blackistSchema)
module.exports = {BlacklistModel}