//Express Initialisation
const express = require('express');
const app = express();

//Environment Variables
require('dotenv').config()
const port = process.env.PORT || 6523;

//Module Imports
const {connectMongodb} = require('./connection');
const userRouter = require('./routes/user');
const balanceRouter = require('./routes/balance');
const transactionRouter = require('./routes/transaction');

//Database Connection
connectMongodb(process.env.MONGOURL);

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/users',userRouter);
app.use('/api/userBalance',balanceRouter);
app.use('/api/transaction',transactionRouter);

app.get('/',(req,res)=>{
    res.send("This is Chase Bank Server.")
})
//Server 
app.listen(port,()=>{
    console.log(`Server Listening on Port: ${port}`);
})
