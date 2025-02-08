
import mongoose from "mongoose";
const { Schema } = mongoose;
const commentSchema =new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Student',

    },
    text:{
        type:String,
        required:true
    },
    reply:{
        type:String,
        default:" "

    },
    createdAt:{
        type:Date,
        default:Date.now()
    }


});
export default mongoose.model('Comment', commentSchema);