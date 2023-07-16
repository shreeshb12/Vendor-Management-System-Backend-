const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');

passport.use(new LocalStrategy({usernameField:'email'},
    (email,password,done)=>{
    // find a user and establish an identity
    User.findOne({email:email})
    .then((user)=>{
        if(!user || user.password!=password)
        {
            console.log('Invalid email id or password');
            return done(null,false);
        }
        console.log('user logged in');
        return done(null,user);
    })
    .catch((err)=>{
        console.log("Error while fetching the user from DB"+err);
        return done(err);
    })
}))

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser((user,done)=>{
    done(null,user.id);
})

// deserializing the user from the key in cookies
passport.deserializeUser((id,done)=>{
    User.findById(id)
    .then((user)=>{
        return done(null,user);
    })
    .catch((err)=>{
        console.log('Error in finding user');
    })
})

passport.checkAuthentication = (req,res,next)=>{
    // check if the user is signed in, then pass on the request to next function()
    if(req.isAuthenticated())
    {
       return next();
    }

    // if user is not signed in redirect to sign-in page
    res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = (req,res,next)=>{

    if(req.isAuthenticated())
    {
        // req.user contains the current signed in user from session cookie and we are just sending it to locals for views.
        res.locals.user=req.user;
    }
    next();
}