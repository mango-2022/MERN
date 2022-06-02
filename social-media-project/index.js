const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const {MONGODB} = require('./config')

// //消息订阅
// const pubSub = new PubSub()

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    //为了保护用户隐私，不使用express的middleware
    // => access the request body in our context
    context: ({req}) => ({req}),
})

//连接数据库
mongoose
    .connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log('Mongodb Connected')
        return server.listen({port: PORT})
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })
    .catch(err => {console.log(err)})