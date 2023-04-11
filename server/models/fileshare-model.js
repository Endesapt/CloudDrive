const {Schema,model}=require("mongoose");

const FileShareSchema=new Schema({
    allowedUsers:{type:Array},
    files:{type:Array},
})

module.exports=model('FileShare',FileShareSchema);