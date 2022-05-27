// express-basic
const express = require('express')
const app = express()

//app.get
app.get('/', (req, res) => {
    res.status(200).send('Home Page')
})

app.get('/about', (req, res) => {
    res.status(200).send('About Page')
})

//app.all
app.all('*', (req, res) => {
    res.status(404).send(`<h1>404 NOT FOUND</h1>`)
})

//app.post
//app.put
//app.delete

//app.use

//app.listen
app.listen(5000, () => {
    console.log('server is listening on port 5000')
})

// express-app
const express = require('express')
const path = require('path')
const app = express()

// setup static and middleware common name: navbar-public or static.
// static assets are files that server doesn't have to change : css, image, javascript
app.use(express.static('./navbar-public'))

// app.get('/', (req, res) => {
//     //absolute path
//     res.sendFile(path.resolve(__dirname, './navbar-public/index.html'))
// })

app.all('*', (req, res) => {
    res.status(404).send(`<h1>404 NOT FOUND</h1>`)
})

//app.listen
app.listen(5000, () => {
    console.log('server is listening on port 5000')
})