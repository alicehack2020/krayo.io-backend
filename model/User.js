import mongoose from "mongoose";
//defining Schema
const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,},
    googleId:{type:String,trim:true},
    imageUrl:{type:String,trim:true}   
})

//Model
const UserModel=mongoose.model("user",userSchema);
export default UserModel;