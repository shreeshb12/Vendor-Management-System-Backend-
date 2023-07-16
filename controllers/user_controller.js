const passport = require('passport');
const user=require('../models/user');

// render the profile page
module.exports.profile=(req,res)=>{
    // if(req.cookies.user_id)
    // {
    //     // find the user in db by id
    //     user.findById(req.cookies.user_id)
    //     .then((data)=>{
    //         return res.render('user_profile',{
    //             title:"profile",
    //             name:data.name
    //         });
    //     })
    //     .catch((err)=>{
    //         console.log("Error while fetching the user"+err);
    //     })
    //     return;
    // }
    // res.redirect('/users/profile');
    return res.render('user_profile',{title:'profile'});
}

// render the signup page
module.exports.signUp=(req,res)=>{
    // check if the user is already logged in
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Sign Up"
    });
}

// render the signin page
module.exports.signIn=(req,res)=>{
    // check if the user is already logged in
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title:"Sign In"
    });
}

// get the signup data and create the user in DB
module.exports.create=(req,res)=>{
    // check if password and confirm password are same
    if(req.body.password!=req.body.confirm_password)
    {
        console.log("password and confirm password doesn't match");
        return res.redirect('back');
    }

    // check if user already exist,if not then create the user in DB
    user.findOne({email: req.body.email})
    .then((data)=>{
        if(!data)
        {
            user.create(req.body)
            .then((data)=>{
                console.log('usercreated');
            })
            .catch((err)=>{
                console.log("Error while creating the user"+err);
            })
        }
        else{
            console.log("User already exist please login")
        }
        res.redirect('/users/sign-in');
    })
    .catch((err)=>{
        console.log("error while fetching the user id"+err);
        res.redirect('back');
    })
}

// create session
module.exports.createSession=(req,res)=>{
    // find user
    user.findOne({email:req.body.email})
    .then((data)=>{
        if(data)
        {
            // validate the password
            if(data.password == req.body.password)
            {
                console.log("logged in sucessfuly");
                // session creation
                res.cookie('user_id',data.id);
                return res.redirect('/users/profile');
            }
        }
        // if user id and password doesn't match
        console.log("Please enter the correct username & password");
        res.redirect('back');
    })
    .catch((err)=>{
        console.log("Error while authenticating"+err);
    })
}

module.exports.createSession_passport=(req,res)=>{
    return res.redirect('/');
}

module.exports.destroySession=(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            console.log('error during logout')
            return;
        }
       return res.redirect('/users/sign-in');
    });
}