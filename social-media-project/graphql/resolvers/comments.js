const {UserInputError, AuthenticationError} = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

module.exports = {
    Mutation: {
        createComment: async (_, {postId, body}, context) => {
            const {username} = checkAuth(context)
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body should not be empty'
                    }
                })
            }

            const post = await Post.findById(postId)

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post
            } else throw new UserInputError('Post not found')
        },
        deleteComment: async (_, {postId, commentId}, context) => {
            const {username} = checkAuth(context)

            const post = await Post.findById(postId)

            //安全性检查，前端user不匹配时可能不会有删除按钮
            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId)
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1)
                    // post.comments.filter(c => c.id !== commentId)
                    await post.save()
                    return post
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } else {
                throw new UserInputError('Post not found')
            }
        }
    }
}