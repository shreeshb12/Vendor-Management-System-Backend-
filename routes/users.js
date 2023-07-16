const express=require('express');
const router=express.Router();
const passport=require('passport')
const userController=require('../controllers/user_controller');

router.get('/profile',passport.checkAuthentication,userController.profile);

router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);

router.post('/create',userController.create);
router.post('/create-session-passport',passport.authenticate(
    'local',{failureRedirect:'/users/sign-in'},
),userController.createSession_passport);

router.get('/destroy-session',userController.destroySession);

module.exports=router;