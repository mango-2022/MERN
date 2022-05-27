const express = require('express')
const app = express()

const {products} = require('./data')

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1> <a href="/api/products">PRODUCTS</a>')
})

app.get('/api/products', (req, res) => {
    const newProducts = products.map((item)=> {
        const {id, name, image} = item
        return {id, name, image}
    })

    //send json data
    res.json(newProducts)
})

//route params
app.get('/api/products/:productID', (req, res) => {
    // console.log(req.params)
    const {productID} = req.params

    const singleProduct = products.find((item) => item.id === Number(productID))

    // console.log(!singleProduct)
    if (!singleProduct) {
        return res.status(404).send('Product Does Not Exist')
    }

    return res.json(singleProduct)
})

app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
    console.log(req.params)
    res.send('hello world')
})

//query string
app.get('/api/v1/query', (req, res) => {
    console.log(req.query)
    const {search, limit} = req.query
    let sortedProducts = [...products]

    if (search) {
        sortedProducts = sortedProducts.filter((product) => {
            return product.name.startsWith(search)
        })
    }
    if (limit) {
        sortedProducts = sortedProducts.slice(0, Number(limit))
    }
    if (sortedProducts.length < 0) {
        // res.status(200).send('no products matched your search')
        //常用
        return res.status(200).json({success: true, data: []})
    }
    return res.status(200).json(sortedProducts)
})

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})