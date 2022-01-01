const express = require('express')
const router = express.Router()

// creating a route
// router.get('/', (req, res) => {
//     res.send('Hello world')
// })

// using EJS
router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router