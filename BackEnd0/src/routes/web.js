const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World and Nodemon!!!')
})

// khai bao route
router.get('/abc', (req, res) => {
    res.send('Hello World abc!')
})

router.get('/hoidanit', (req, res) => {
    res.render('sample');
})

module.exports = router;