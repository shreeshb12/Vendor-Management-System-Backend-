const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1/codial_development");
const db=mongoose.connection;

db.on('error',console.log.bind("error connecting to MONGODB"));

db.once('open',()=>{
    console.log("connected to database sucessfully");
});

module.exports=db;