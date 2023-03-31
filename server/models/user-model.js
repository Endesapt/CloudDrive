const {Schema,model}=require("mongoose");

const UserShema=new Schema({
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    files:{type:Array},
})

module.exports=model('User',UserShema);