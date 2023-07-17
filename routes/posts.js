const express=require('express');
const router=express.Router();
const passport=require('passport');
const postController=require('../controllers/post_controller.js');

router.post('/create',passport.checkAuthentication,postController.create);
router.get('/destroy/:id',postController.destroy);
router.use('/comments',require('./comments'));

module.exports=router;