// GET: get all orders www.store.com/api/orders
// POST: place an order (send data) www.store.com/api/orders
// GET: get single order (path params) www.store.com/api/orders/:id
// PUT: update specific order (params + send data) www.store.com/api/orders/:id
// DELETE: delete order (path params) www.store.com/api/orders/:id

const express = require('express')
const app = express()

let { people } = require('./data')

//static assets
app.use(express.static('./methods-public'))
//BUILD-IN MIDDLEWARE: parsing the URL-encoded data with query string library(when false)
app.use(express.urlencoded({extended: false}))
//parse json
app.use(express.json())

app.get('/api/people', (req, res) => {
    console.log(people)
    res.status(200).json({success: true, data: people})
})

app.post('/api/people', (req, res) => {
    const {name} = req.body
    if (!name) {
        return res.status(400).json({
            success: false,
            msg:'please provide name value'})
    }
    res.status(201).send({success: true, person:name})
})

app.post('/api/postman/people', (req, res) => {
    const {name} = req.body
    if (!name) {
        return res.status(400).json({
            success: false,
            msg:'please provide name value'})
    }
    res.status(201).send({success: true, data:[...people, name]})
})

app.put('/api/people/:id', (req, res) => {
    const {id} = req.params
    const {name} = req.body

    const person = people.filter(people => people.id === Number(id))
    if (!person) {
        return res.status(404).json({
            success: false,
            msg:`no person with id ${id}`})
    }
    const newPeople = people.map(person => {
        if (person.id === Number(id)) {
            person.name = name
        }
        return person
    })
    res.status(200).json({success: true, data: newPeople})
})

app.delete('/api/people/:id', (req, res) => {
    const person = people.find(people => people.id === Number(req.params.id))
    if (!person) {
        return res.status(404).json({
            success: false,
            msg:`no person with id ${req.params.id}`})
    }
    const newPeople = people.filter(person => person.id !== Number(req.params.id))
    res.status(200).json({success: true, data: newPeople})
})

app.post('/login', (req, res) => {
    //console.log(req.body)
    const {name} = req.body
    if (name) {
        return res.status(200).send(`Welcome ${name}`)
    }
    res.status(401).send('Please provide credentials')
})

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})