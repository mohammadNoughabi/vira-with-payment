const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String
    } ,
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
}, { timestamps: true });

const blog = mongoose.model("Blog", blogSchema);

module.exports = blog;
