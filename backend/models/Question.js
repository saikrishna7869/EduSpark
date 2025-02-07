const mongoose=require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
    videoid:{
        type:Schema.ObjectId,
        ref:"Video"
    },
    Questions:[{
        type:Schema.Types.ObjectId,
        ref:'QuizQue'

    }]


});

