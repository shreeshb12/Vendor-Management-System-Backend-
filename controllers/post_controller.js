const Post=require('../models/post');

module.exports.create=(req,res)=>{
    Post.create({
        content:req.body.content,
        user:req.user._id
    })
    .then((data)=>{
        res.redirect('back');
    })
    .catch((err)=>{
        console.log("error in creating the post"+err);
    })
}