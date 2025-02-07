const moongoose=require("mongoose");

const {Schema}=mongoose;

const QuerSchema=new Schema({
    userid:{
        type:Object.Types.Schema,
        ref:"User"
    },
    question:{
        type:String,
        required:true
    },
    answers:[{
        user:{
            type:Object.Types.Schema,
            ref:"User"

        },
        answer:{
            type:String,
            required:true
        },

    }]
});


module.exports = mongoose.model("QuerSchema", QuerSchema);