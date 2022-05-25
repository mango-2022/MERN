const EventEmitter = require('events')

//on - listen for an event
//emit - emit an event
const customEmitter = new EventEmitter

customEmitter.on('response', (name, id)=>{
    console.log(`data received user: ${name} , id: ${id}`)
})
customEmitter.on('response', ()=>{
    console.log(`some other logic`)
})

customEmitter.emit('response', 'john', 34)

//1. 同一个名字的event可以有多个
//2. 顺序有关，先listen再emit
//3. 可以传参数

// http module example
const http = require('http')

//方法1：
// const server = http.createServer((req, res) => {
//     res.end('welcome')
// })

//方法2： using Event Emitter API
const server = http.createServer()
//emits request event
// subscribe to it / listen for it / respond to it
server.on('request', (req, res) => {
    res.end('Welcome')
})

server.listen(5000)