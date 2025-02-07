import mongoose from "mongoose"
const EducatorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
 score:{
    type:Number,
    default:0
 },
  isStudent:{
    type:Boolean,
    default: false
  },
  Videos:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"

  }]


});


export default mongoose.model("Educator", EducatorSchema);
