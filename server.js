const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
const taskRoute = require('./routes/taskRoute');
const dotenv = require('dotenv');     //import dotenv
const port = process.env.PORT || 3002;  




//using middleware for parsing json requests
app.use(express.json());

dotenv.config();

app.use('/user', userRoute);
app.use('/task', taskRoute);


// run server
app.listen(port, () => {
    console.log('Server is running on port 3002');
});