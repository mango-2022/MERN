const express = require('express')
const app = express()
const morgan = require('morgan')

const logger = require('./logger')
const authorize = require('./authorize')

// tiny: provide the most essential data
app.use(morgan('tiny'))

// app.use(express.static('./navbar-public'))

// 统一使用 invoke for any router
// app.use([logger, authorize])
// 返回值是 /home/about/api-products/api-items

// app.use('/api', logger)
//返回值是 /home/about/products/items

// req => middleware => res
// 除非middleware直接send back某些信息，否则必须：
// 1. pass it on to the next middleware (比如get methods)
// 2. terminate the whole cycle
// 最好在单独的文件夹里
// const logger = (req, res, next) => {
//     const method = req.method
//     const url = req.url
//     const time = new Date().getFullYear()
//     console.log(method, url, time)
//     next()
// }

app.get('/', (req, res) => {
    res.send('Home')
})

app.get('/about', (req, res) => {
    res.send('About')
})

app.get('/api/products', (req, res) => {
    res.send('Products')
})

app.get('/api/items',
    // [logger, authorize],
    (req, res) => {
        // in any of router, have access to the req.query.user
        console.log(req.user)
        res.send('items')
    })

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const express = require('express')
const app = express()

// req => middleware => res
// 除非middleware直接send back某些信息，否则必须：
// 1. pass it on to the next middleware (比如get methods)
// 2. terminate the whole cycle
// 最好在单独的文件夹里
const logger = (req, res, next) => {
    const method = req.method
    const url = req.url
    const time = new Date().getFullYear()
    console.log(method, url, time)
    next()
}

app.get('/', logger, (req, res) => {
    res.send('Home')
})

app.get('/about', logger, (req, res) => {
    res.send('About')
})

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})