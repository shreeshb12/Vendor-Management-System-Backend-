const Post=require('../models/post');
const Comment=require('../models/comment');

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

module.exports.destroy=(req,res)=>{
    Post.findById(req.params.id)
    .then((post)=>{
        console.log(post.user+" "+req.user.id);
        if(post.user == req.user.id)
        {
            console.log(post.user == req.user.id);
            post.deleteOne();

            Comment.deleteMany({post:req.params.id})
            .then((data)=>{
                console.log('post deleted');
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    })
    .catch((err)=>{
        console.log(err);
    })
    res.redirect('back');
}