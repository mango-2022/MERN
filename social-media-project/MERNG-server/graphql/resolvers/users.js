const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require("apollo-server");

const {validateRegisterInput, validateLoginInput} = require('../../util/validators')
const {SECRET_KEY} = require('../../config')
const User = require('../../models/User')

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, SECRET_KEY, {expiresIn: '1h'})
}

module.exports = {
    Mutation: {
        // mutation四个参数： parent, args, context, info
        // parent: what was the input from the last step
        // args: registerInput 可以直接在第二个参数解构
        // 用不到的context和info可以省略，parent用不到可以用_占位

        async login(_, {username, password}) {
            const {errors, valid} = validateLoginInput(username, password)

            //判断valid是否为空
            if (!valid) {
                throw new UserInputError('Errors', {errors})
            }

            //查找用户名是否存在
            const user = await User.findOne({username})
            // console.log(user)
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', {errors})
            }

            //查找密码是否匹配
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong password'
                throw new UserInputError('Wrong password', {errors})
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token,
            }
        },

        async register(_, {registerInput: {username, email, password, confirmPassword}}) {

            //validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', {errors})
            }
            //make sure user doesn't already exist
            const user = await User.findOne({username})
            if (user) {
                throw new UserInputError('Username is taken', {
                    error: {
                        username: 'This username is taken'
                    }
                })
            }

            //hash password and create an auth token
            //bcryptjs jsonwebtoken
            const newPassword = await bcrypt.hash(password, 12)

            //form user object
            const newUser = new User({
                username,
                email,
                password: newPassword,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            //create a token for user
            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token,
            }
        }
    }
}