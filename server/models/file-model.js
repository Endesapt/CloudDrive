const {Schema,model}=require("mongoose");

const File=new Schema({
    name:{type:String,required:true},
    ext:{type:String,required:true},
    URL:{type:String,required:true}
})

module.exports=model('File',File);