const express  = require('express');
const mongoos = require('mongoose');
const dbConnect = require('./config/dbConnection');  // it is export wi

const authRouter = require("./routes/authentication")
// const {powerStationRouter} = require('./src/routes/powerStation');

app = express()

app.get('/health', (req, res) => {
    res.send('Hello World')
})

app.use('/auth', authRouter);

dbConnect().then(()=>{
    app.listen(3000,()=>{
        console.log("server is running on port 3000");
    })    
}).catch(()=>{
    console.log("db not connect")
})


// app.listen(3000,()=>{
//     console.log("server is running on port 3000");
// })
