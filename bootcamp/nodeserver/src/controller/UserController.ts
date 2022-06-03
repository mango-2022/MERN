import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/error";
import {User} from "../entity/User";

export class UserController {

    public static get repo(){
        return getRepository(User)
    }

//破坏封装 但是可以不通过new实例直接访问
    static async all(request: Request, response: Response, next: NextFunction) {
        let users = []
        try {
            users = await UserController.repo.find()
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, users))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        let {userId} = request.params
        if (!userId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, null))
        }

        let user = null
        try {
            //找到或fail
            user = await UserController.repo.findOneOrFail(userId)
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, user))
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let {firstName, lastName, age, email, password} = request.body
        let user = new User()
        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password
        user.isActive = true

        console.log('new User', user)
        try {
            const errors = await validate(user)
            if (errors.length > 0) {
                let err = new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, errors)
                return response.status(400).send(err)
            }

            await UserController.repo.save(user)
        } catch (error) {
            console.log('error, write to database', error)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorStore, error))
        }

        //创建成功
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, null))
    }

    static async update(request: Request, response: Response, next: NextFunction) {
        //userId判断产品是否存在
        let {userId} = request.params
        if (!userId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, null))
        }

        let user = null
        try {
            user = await UserController.repo.findOneOrFail(userId)
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        //重新赋值
        let {firstName, lastName, age, email, password} = request.body
        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password

        //validate
        try {
            const errors = await validate(user)
            if (errors.length > 0) {
                let err = new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, errors)
                return response.status(400).send(err)
            }

            await UserController.repo.save(user)
        } catch (error) {
            console.log('error, write to database', error)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorStore, error))
        }

        //更新完写入数据库
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, null))
    }

    static async delete(request: Request, response: Response, next: NextFunction) {

    }
}