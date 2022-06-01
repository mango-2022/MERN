const {gql} = require("apollo-server");

module.exports = gql`
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
#       在服务器计算 避免client拥挤
        commentCount: Int!
        likeCount: Int!
    }
    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
#        返回所有的post，存在一个数列中
        getPosts: [Post]
#        通过postId(required)返回指定的Post
        getPost(postId: ID!): Post
    }
    type Mutation {
#       注册用户，返回一个user(required)
        register(registerInput: RegisterInput): User!
#       使用用户名和密码登陆，返回一个user！
        login(username: String!, password: String!): User!
#       通过body的内容添加一个post，返回一个post！
        createPost(body: String!): Post!
#       通过postId！删除指定的post
        deletePost(postId:ID!): String!
        
        createComment(postId:ID!, body:String!): Post!
#       直接删除post会导致找不到commentId？
        deleteComment(postId:ID!, commentId:ID!): Post!
#       like/unlike toggle function
        likePost(postId:ID!):Post!
    }
#   订阅功能
#    type Subscription {
#        newPost: Post!
#    }
`