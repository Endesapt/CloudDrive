const {Schema,model}=require("mongoose");

const File=new Schema({
    name:{type:String,required:true},
    data:{type:Buffer,required:true},
    encoding:{type:String,required:true},
    mimetype:{type:String,required:true},
})

module.exports=model('File',File);