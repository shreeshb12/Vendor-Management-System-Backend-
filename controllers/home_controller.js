const user=require('../models/user');
const post=require('../models/post');

module.exports.home=(req,res)=>{
    // console.log(req.cookies);

    post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{ 
            path:'user'
        }
    })
    .then((data)=>{
        return res.render('home',{
            title:"Home",
            post:data
        });
    })
}