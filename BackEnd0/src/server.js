const express = require('express')
const path = require('path');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME || 'localhost2';

//console.log(">>> check env :", process.env);
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World and Nodemon!!!')
})

// khai bao route
app.get('/abc', (req, res) => {
    res.send('Hello World abc!')
})

app.get('/hoidanit', (req, res) => {
    res.render('sample');
})

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})
