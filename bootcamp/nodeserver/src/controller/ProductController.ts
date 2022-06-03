import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Product} from "../entity/Product";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/error";

export class ProductController {

    public static get repo(){
        return getRepository(Product)
    }

//破坏封装 但是可以不通过new实例直接访问
    static async all(request: Request, response: Response, next: NextFunction) {
        let products = []
        try {
            products = await ProductController.repo.find()
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, products))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        let {productId} = request.params
        if (!productId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, null))
        }

        let product = null
        try {
            //找到或fail
            product = await ProductController.repo.findOneOrFail(productId)
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, product))
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let {name, price, media, slug, description} = request.body
        let product = new Product()
        product.price = price
        product.name = name
        product.media = media
        product.slug = slug
        product.description = description
        product.isActive = true

        console.log('new product', product)
        try {
            const errors = await validate(product)
            if (errors.length > 0) {
                let err = new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, errors)
                return response.status(400).send(err)
            }

            await ProductController.repo.save(product)
        } catch (error) {
            console.log('error, write to database', error)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorStore, error))
        }

        //创建成功
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, null))
    }

    static async update(request: Request, response: Response, next: NextFunction) {
        //productId判断产品是否存在
        let {productId} = request.params
        if (!productId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, null))
        }

        let product = null
        try {
            product = await ProductController.repo.findOneOrFail(productId)
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        //重新赋值
        let {name, price, media, slug, description} = request.body
        product.price = price
        product.name = name
        product.media = media
        product.slug = slug
        product.description = description

        //validate
        try {
            const errors = await validate(product)
            if (errors.length > 0) {
                let err = new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, errors)
                return response.status(400).send(err)
            }

            await ProductController.repo.save(product)
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