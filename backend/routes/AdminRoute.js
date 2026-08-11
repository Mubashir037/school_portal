const express=require('express');
const router=express.Router();
const loginLimiter=require('../middleware/ratelimiter');
const middleware=require('../middleware/auth');
const Admin=require('../controllers/admincontroller');
console.log(Admin);
router.post('/login',loginLimiter,Admin.login);
router.post('/register',Admin.register);
module.exports = router;
