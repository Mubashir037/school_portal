const students=require('../models/Student');
//create
const addstudent=async(req,res)=>{
    try{
        const student=await students.create(req.body);
        res.status(201).json(student);

    }
    catch(err){
        res.status(400).json({
            message:err.message
        });
    }
}
//delete
const deletestudent=async(req,res)=>{
    try{
        const student=await students.findOneAndDelete({grno:req.params.grno});
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        res.status(200).json({
            message:"Student deleted successfully"
        });
    }
    catch(err){
        res.status(400).json({
            message:err.message
        });
    }
}
//update
const updatestudent=async(req,res)=>{
    try{
        const student=await students.findOneAndUpdate({grno:req.params.grno},req.body,{new:true});
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        res.status(200).json(student);
    }
    catch(err){
        res.status(400).json({
            message:err.message
        });
    }
}
//get student
const getstudent=async(req,res)=>{
    try{
        const student=await students.findOne({grno:req.params.grno});
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        res.status(200).json(student);
    }
    catch(err){
        res.status(400).json({
            message:err.message
        });
    }
}
//get all students
const getallstudents=async(req,res)=>{
    try{
        const studentsList=await students.find();
        res.status(200).json(studentsList);
    }
    catch(err){
        if (err.code === 11000) {
        return res.status(400).json({ message: "A student with this GR No already exists" });
    }
        res.status(400).json({
            message:err.message
        });

    }
}
module.exports={addstudent,deletestudent,updatestudent,getstudent,getallstudents};
  