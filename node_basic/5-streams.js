//create big file
const {writeFileSync} = require('fs')
for (let i = 0; i < 1000; i++) {
    writeFileSync(
        './content/big.txt',
        `hello world ${i}\n`,
        {flag : 'a'}
    )
}

// writeable
// readable
// duplex
// transform

const {fs, createReadStream} = require('fs')
const http = require('http')

const stream = createReadStream(
    './content/big.txt', {
        highWaterMark : 90000,
        encoding: "utf-8"
    })

//default 64kb
//last buffer - reminder
//highWaterMark - control size

stream.on('data', (result) => {
    console.log(result)
})

stream.on('error', (err) => {
    console.log(err)
})

// http example
http
    .createServer(function (req, res) {
        //方法1：
        // const text = fs.readFileSync('./content/big.txt', 'utf-8')
        // res.end(text)

        //方法2：
        const fileStream = fs.createReadStream('./content/big.txt', "utf-8")
        fileStream.on('open', () => {
            //pushing from the read stream into write stream
            fileStream.pipe(res)
        })
        fileStream.on('error', (err) => {
            res.end(err)
        })
    })