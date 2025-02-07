import mongoose, { SchemaType } from "mongoose"
const StudentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score:{
    type: Number,
    default: 0
  },
  quizparticepated:{
    type:Number,
    default: 0
  },
  level:{
    type: Number,
    default:10,

  },
  topics:[{
    text:{
      type:String,

    }
  }],
  isStudent:{
    type:Boolean,
    default: true
  },
  savedvideos:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Video'

  }],
  queries:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Query'
  }]


});


export default mongoose.model("Student", StudentSchema);
