const mongoose=require('mongoose'); console.log(process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL);
const db=mongoose.connection;

db.on('error',console.log.bind("error connecting to MONGODB"));

db.once('open',()=>{
    console.log("connected to database sucessfully");
});

module.exports=db;