const user=require('../models/user');
module.exports.home=(req,res)=>{
    console.log(req.cookies);
    return res.render('home',{
        title:"Home"
    });
}