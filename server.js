if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()

//INTEGRATING OUR MODEL - SETTING UP DB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

const indexRouter = require('./routes/index') //hooking up server to use my routes step 1- importing the route into our server

// configuring Express application
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') //setting where our views will be coming from
app.set('layout', 'layouts/layout') // hook up express layout
app.use(expressLayouts)
app.use(express.static('public')) //telling express where our public files(eg style sheets, JS files, images) are going to be

app.use('/', indexRouter) //hooking up server to use my routes step 2

app.listen(process.env.PORT || 3000)