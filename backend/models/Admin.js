const mongoose=require('mongoose');
const Admin_schema=mongoose.Schema({
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    }
})
module.exports=mongoose.model('Admin_schema',Admin_schema);