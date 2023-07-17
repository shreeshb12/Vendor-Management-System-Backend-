const { localsName } = require('ejs');
const Comment=require('../models/comment');
const Post=require('../models/post')

module.exports.create=(req,res)=>{
    Post.findById(req.body.post)
    .then((post)=>{
        if(post)
        {
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            })
            .then((comment)=>{
                post.comments.push(comment);
                post.save();
            })
            .catch((err)=>console.log(err));
        }
    })
    .catch((err)=>{
        console.log('error while creating a comment'+err);
    })
    res.redirect('back');
}