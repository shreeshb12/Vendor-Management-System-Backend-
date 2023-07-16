const express=require("express");
const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const cookieParser=require('cookie-parser');
const sassMiddleware=require('node-sass-middleware');

//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const MongoStore=require('connect-mongo');
const { default: mongoose, connection } = require("mongoose");

app.use(sassMiddleware({
    src:'./assets/sass',
    dest:'./assets/css',
    debug: true,
    outputStyle:'extended',
    prefix:'/css'
}))
app.use(express.urlencoded())
app.use(cookieParser());
app.use(express.static('./assets'));
// use layouts
app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// set up the view engine
app.set('view engine','ejs');
app.set('views',"./views");

// mongostore is used to store the cookie in db
app.use(session({
    name:'user_id',
    secret:'Shreesh',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*260*24)
    },
    store:MongoStore.create({
        client:mongoose.connection.getClient(),
        autoRemove:false
    })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//use express router
app.use('/',require('./routes'));

app.listen(port,(err)=>{
    if(err)
    {
        console.error(err);
        return;
    }
    console.log(`Application is running at ${port}`);
})