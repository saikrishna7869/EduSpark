import mongoose from "mongoose";
const { Schema } = mongoose;
const QuizQue=new Schema({
    ques:{
        type:String,
        required:true
    },
    A:{
        type:String,
        required:true
    },
    B:{
        type:String,
        required:true
    },
    C:{
        type:String,
        required:true
    },
    D:{
        type:String,
        required:true
    },
    ans:{
        type:String,
        required:true
    },
    explanation:{
        type:String,
        required:true
    }



});


export default  mongoose.model("QuizQue", QuizQue);
