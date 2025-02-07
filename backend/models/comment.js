const { text } = require("express");
const mongoose=require("mongoose");
const { Schema } = mongoose;
const commentSchema =new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',

    },
    text:{
        type:String,
        required:true
    },
    reply:{
        type:String,
        

    },


});