const express = require('express')
const app = express()

const people = require('./routes/people')
const auth = require('./routes/auth')

//static assets
app.use(express.static('./methods-public'))

//BUILD-IN MIDDLEWARE: parsing the URL-encoded data with query string library(when false)
app.use(express.urlencoded({extended: false}))

//parse json
app.use(express.json())

//base: /api/people
app.use('/api/people', people)

//base: /api/login
app.use('/login', auth)

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})