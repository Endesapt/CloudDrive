const {Schema,model}=require("mongoose");

const FileShareSchema=new Schema({
    allowedUsers:{type:Array},
    files:{type:Array},
    name:{type:String,required:true},
    addUserId:{type:String,required:true},
})

module.exports=model('FileShare',FileShareSchema);