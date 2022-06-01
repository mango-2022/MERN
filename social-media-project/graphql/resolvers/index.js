const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentsResolvers = require('./comments')

//for each query or mutation or subscription, it has its corresponding resolver
module.exports = {
    //every time you send query or mutation that return a post, it will go through the post and update the value
    Post: {
        commentCount: parent => parent.comments.length,
        likeCount: parent => parent.likes.length,
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    // Subscription: {
    //     ...postsResolvers.Subscription,
    // }
}