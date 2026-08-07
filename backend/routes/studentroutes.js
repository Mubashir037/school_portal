const express=require('express');
const router=express.Router();
const {addstudent,deletestudent,updatestudent,getstudent,getallstudents}=require('../controllers/studentcontroller');
const middleware=require('../middleware/auth');
router.post('/addstudent',middleware,addstudent);
router.put('/update/:grno',middleware,updatestudent);
router.get('/getstudent/:grno',middleware,getstudent);
router.get('/getallstudents',middleware,getallstudents);
router.delete('/deletestudent/:grno',middleware,deletestudent);
module.exports=router;


