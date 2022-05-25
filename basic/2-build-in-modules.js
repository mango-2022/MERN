//os
const os = require('os')

//info about current user
const user = os.userInfo()
console.log(user)

//method returns the system uptime in seconds
console.log(`The system uptime is ${os.uptime()} seconds`)

const currentOS = {
    name: os.type(),
    release: os.release(),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
}
console.log(currentOS)

//path
const path = require('path')

console.log(path.sep)

const filePath = path.join('/content', 'subfolder', 'text.txt')
console.log(filePath)

const baseFile = path.basename(filePath)
console.log(baseFile)

const absolutePath = path.resolve(__dirname, 'content', 'subfolder', 'text.txt')
console.log(absolutePath)

//fs-sync
const {readFileSync, writeFileSync} = require('fs')

// const fs = require('fs')
// fs.readFileSync()

const first = readFileSync('./content/first.txt', 'utf-8')
const second = readFileSync('./content/second.txt', 'utf-8')
//每次执行都会写入，不会覆盖
writeFileSync(
    './content/result-sync.txt',
    `Here is the result: ${first}, ${second}`,
    {flag: 'a'}
)

//fs-async
const {readFile, writeFile} = require('fs')

readFile(
    './content/first.txt', 'utf-8',
    (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        const first = result
        readFile(
            './content/second.txt', 'utf-8',
            (err, result) => {
                if (err) {
                    console.log(err)
                    return
                }
                const second = result
                writeFile(
                    './content/result-async.txt',
                    `Here is the result: ${first}, ${second}`,
                    (err, result) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                        console.log(result)
                    }
                )
            })
    })

//http
const http = require('http')

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.end('Welcome to our Home Page')
    }
    if (req.url === "/about") {
        res.end('Here is our short history')
    }
    res.end(`<h1>Oops!</h1>
<p>404!</p>
<a href="/">back home</a>`)
})

server.listen(5000)
