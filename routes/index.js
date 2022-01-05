const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
    let books = []
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { books: books })
})

module.exports = router

//version 1 
/*const express = require('express')
const router = express.Router()

// creating a route
// router.get('/', (req, res) => {
//     res.send('Hello world')
// })

// using EJS
router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router*/