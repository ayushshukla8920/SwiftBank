//Express Initialisation
const express = require('express');
const app = express();
const cors = require('cors');

//Environment Variables
require('dotenv').config()
const port = process.env.PORT;

//Module Imports
const cookieParser = require('cookie-parser');
const {connectMongodb} = require('./connection');
const homeRouter = require('./Routes/home');
const logoutRouter = require('./Routes/logout');
const kycRouter = require('./Routes/kyc');
const depositRouter = require('./Routes/deposit');
const { startSessionCleanup } = require('./middlewares/cAuth');
const { startKycCleanup } = require('./middlewares/kyc');
const session = require('express-session');

connectMongodb(process.env.MONGOURL);
startSessionCleanup();
startKycCleanup();

//Middlewares
app.use(express.json())
app.use(cors({
    origin: 'https://swift-bank-ayush.vercel.app', // Your frontend domain
    credentials: true, // Allow credentials (e.g., cookies)
}));

// Optional: Explicit handling of preflight requests (if needed)
app.options('*', cors({
    origin: 'https://swift-bank-ayush.vercel.app',
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 's#e$s%s^i*o(n',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


//Routes
app.use('/',homeRouter);

app.use('/logout', logoutRouter);

app.use('/kyc',kycRouter);

app.use('/deposit',depositRouter);

app.listen(port,()=>{
    console.log(`Server Listening on Port: ${port}`);
})
