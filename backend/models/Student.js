const mongoose=require('mongoose');
const studentschema=new mongoose.Schema({
    grno:{type:String,unique:true,required:true},
    first_name:{type:String,required:true},
    last_name:{type:String},father_name:{type:String},
    father_no:{type:String,match: [/^\d{11}$/, 'Father contact number must be exactly 11 digits']},
    father_cnic:{type:String, match: [/^\d{13}$/, 'CNIC must be exactly 13 digits']},
    dob:{type:Date,
        validate: {
    validator: (v) => v <= new Date(),
    message: 'Date of birth cannot be in the future'
  }
    },
    class:{type:String},
    cast:{type:String}
})
module.exports=mongoose.model('Student',studentschema);