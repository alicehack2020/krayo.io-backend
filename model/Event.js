import mongoose from "mongoose";
//defining Schema
const eventSchema=new mongoose.Schema({
    userId:{type:String,required:true,trim:true},
    fileName:{type:String,required:true,trim:true},
    type:{type:String,required:true,trim:true}, 
    url:{type:String,required:true,trim:true}, 
})

//Model
const EventModel=mongoose.model("event",eventSchema);
export default EventModel;
