const {AuthenticationError, UserInputError} = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require('../../util/check-auth')

module.exports = {
    Query: {
        //need post module to fetch posts
        //maybe your query will never fail
        //but if your query fails it might stop your actual server
        async getPosts() {
            try {
                //不给condition， find all of them
                //sort：根据createdAt倒序排列
                const posts = await Post.find().sort({createdAt: -1})
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },
        //通过postId获取单个post
        async getPost(_, {postId}) {
            try {
                const post = await Post.findById(postId)
                console.log(post)
                if (post) {
                    return post
                } else {
                    //todo: error不显示
                    throw new Error('post not found')
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        //protected resolver is going to work: make sure user is authenticated
        //user will log in and get an authentication token
        // => they need to put it in an authorization header
        // => send that header with the request
        // => get that token and decode it => get information
        async createPost(_, {body}, context) {
            const user = checkAuth(context)
            //不需要检查user因为在checkAuth里设置了条件
            console.log(user)

            //server validation
            if (body.trim() === '') {
                throw new Error('Post body must not be empty')
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save()

            //消息发布
            // context.pubSub.publish('NEW_POST', {
            //     newPost: post
            // })

            return post
        },
        async deletePost(_, {postId}, context) {
            const user = checkAuth(context)

            try {
                //通过post id找到对应post
                const post = await Post.findById(postId)

                if (user.username === post.username) {
                    await post.delete()
                    return 'Post deleted successfully'
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        async likePost(_, {postId}, context) {
            const {username} = checkAuth(context)

            const post = await Post.findById(postId)
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    //post already likes, unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    //not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save()
                return post
            } else throw new UserInputError('Post not found')
        }
    },
    Subscription: {
        newPost: {
            //消息订阅
            subscription: (_, args, {pubSub}) => pubSub.asyncIterator('NEW_POST')
        }
    }
}