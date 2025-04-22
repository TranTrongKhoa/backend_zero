const express = require('express')
const path = require('path');

const app = express()
const port = 8080
const hostname = "localhost"


app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('Hello World!!!')
})

// khai bao route
app.get('/abc', (req, res) => {
    res.send('Hello World abc!')
})

app.get('/hoidanit', (req, res) => {
    //res.render('./views/sample.ejs')
    res.render('sample', { title: 'Hello World' });
})

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})
