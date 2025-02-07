import mongoose from "mongoose";
const { Schema } = mongoose;
const VideoSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    user:{
        type:Schema.Types.ObjectId,
        ref:"Educator",
        required:true
    },
    language:{
        type:String,
        required:true
    },
    videolink:
    {
        
        type:String,
        default:'https://res.cloudinary.com/ddyvolryf/video/upload/v1738747843/videos/wo0xfnmdoo0ibvxfuzma.mp4'
    },
    audiolink:{
        type:String,
        default:'https://res.cloudinary.com/ddyvolryf/raw/upload/v1738851001/audio/mxm3cj86kibzutchgrlh.wav'
    },
    summary:{
        type:String,
        required:true
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        

    }],
    rating:{
        type:Number,
        default:0
    },
    level:{
        type:Number,
        default:10
    },
    topic:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    ratingcount:{
        type:Number,
        default:0
    },
    ratedusers:[{
        type: Schema.Types.ObjectId,
        ref:'user'
    }],
    questions:[{
        type: Schema.Types.ObjectId,
        ref: 'QuizQue'

    }]


});
const Video=mongoose.model("Video",VideoSchema);
export default Video;