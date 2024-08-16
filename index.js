const express=require("express");
require('dotenv').config();

const router = express.Router();
const db=require('./config/mongoose');
const bodyParser=require('body-parser');
const app=express();

/* Middleware */
const authMiddleware=require('./middleware/authMiddleware');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/* ROUTE IMPORTS */
const vendorRoutes =require('./routes/vendorRoutes');
const purchaseOrderRoutes =require('./routes/vendorRoutes');
const historicalPerformanceRoutes =require('./routes/vendorRoutes');
const userRoutes=require('./routes/userRoute');

/* ROUTES */
app.use('api/auth', userRoutes);
app.use('/api/vendors',authMiddleware,vendorRoutes);
app.use('api/purchase-orders',authMiddleware, purchaseOrderRoutes);
app.use('api/vendors',authMiddleware,historicalPerformanceRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the Vendor Management System');
});

/* SERVER */
app.listen(process.env.PORT,(err)=>{
    if(err)
    {
        console.error(err);
        return;
    }
    console.log(`Server is running on ${process.env.PORT}`);
})