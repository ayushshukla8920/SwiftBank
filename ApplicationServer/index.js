//Express Initialisation
const express = require('express');
const app = express();
const cors = require('cors');

//Environment Variables
require('dotenv').config()
const port = process.env.PORT;

//Module Imports
const {connectMongodb} = require('./connection');
const homeRouter = require('./Routes/home');
const logoutRouter = require('./Routes/logout');
const kycRouter = require('./Routes/kyc');
const depositRouter = require('./Routes/deposit');
const authRouter = require('./Routes/auth');
const transactionRouter = require('./Routes/transaction');
const {validateSession} = require('./middlewares/sessions');

connectMongodb(process.env.MONGOURL);

//Middlewares
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Public Routes
app.use('/auth',authRouter);

app.use(validateSession);

//Authenticated Routes

app.use('/', homeRouter);
app.use('/logout', logoutRouter);
app.use('/kyc',kycRouter);
app.use('/deposit',depositRouter);
app.use('/trxn',transactionRouter);

app.listen(port,()=>{
    console.log(`Server Listening on Port: ${port}`);
})
