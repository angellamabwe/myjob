const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/Book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Books route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title !== null && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore !== null && req.query.publishedBefore !== '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter !== null && req.query.publishedAfter !== '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book route - purpose: to display the new Book form 
router.get('/new', async (req, res) => {
    //try/catch block moved to renderNewPage() as a DRY implementation
    renderNewPage(res, new Book())
})

// Create Book route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    // CREATING BOOK OBJECT
    const book = new Book({ //from { to }, its a JSON object of book
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //need 2 wrap this inside og new Date bcz req.body.publishDate is going to return a string
        //therefore we are converting a string into a date which we can then store into our DB
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    // SAVING BOOK OBJECT
    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch { //code to be run if we do've an error saving a book
        // code to remove the book cover that was saved in bookCover folder - need fs to do this
        if (book.coverImageName !== null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true) //true because hasError should be true
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => { //unlink will remove e file we don't want on our server
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({}) //since we're passing the authors into e page, we want 1st get all of our authors
        const params = {
            authors: authors, //passing the authors & book variable 2 e new.ejs page, meaning all authors will be send
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book';
        res.render('books/new', params //if there is an error the catch bolck will handle it, o/wise this code will run
        )
    } catch {
        res.redirect('/books')
    }
}

module.exports = router