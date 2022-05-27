// event loop
// javascript is synchronous and single threaded => offload time-consuming tasks

const http = require('http')

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.end('Home Page')
    }
    if (req.url === '/about') {
        // BLOCKING CODE!!!!
        for (let i = 0; i < 1000; i++){
            for (let j = 0; j < 1000; j++){
                console.log(`${i} ${j}`)
            }
        }
        res.end('About Page')
    }
})

server.listen(5000, ()=>{
    console.log('server listening on port 5000')
})


//第三种：使用.promises将原本的readFile和writeFile变成promise
const {readFile, writeFile} = require('fs').promises

//第二种：使用util，新建build-in promise
// const util = require('util')
// const readFilePromise = util.promisify(readFile)
// const writeFilePromise = util.promisify(writeFile)

const start = async () => {
    try {
        const first = await readFile('./content/first.txt', 'utf-8')
        const second = await readFile('./content/second.txt', 'utf-8')
        await writeFile(
            './content/result-mind-grenade.txt',
            `This is awesome: ${first} ... ${second}`
        )
        console.log(first, second)
    } catch (error) {
        console.log(error)
    }
}

start()

//第一种：手写一个promise 返回内容
// const getText = (path) => {
//     return new Promise((resolve, reject) => {
//         readFile(path, 'utf-8', (err, data) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(data)
//             }
//         })
//     })
// }

// getText('./content/first.txt')
//     .then(result => console.log(result))
//     .catch(err => console.log(err))
