import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order"
import {Err, ErrStr, HttpCode} from "../helper/error";
import {validate} from "class-validator";
import {IdChecks, MkController} from "./MkController";
import {UserController} from "./UserController";
import {ProductController} from "./ProductController";


export class OrderController extends MkController{

    public static get repo(){
        return getRepository(Order)
    }

//破坏封装 但是可以不通过new实例直接访问
    static async all(request: Request, response: Response, next: NextFunction) {
        let orders = []
        try {
            orders = await OrderController.repo.find()
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orders))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        let {orderId} = request.params
        if (!orderId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, null))
        }

        let order = null
        try {
            //找到或fail
            order = await OrderController.repo.findOneOrFail(orderId)
        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorNoObj, error))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }

    static async validateOrder(user: number, products: number[]){
        if (typeof user !== 'number' ||
            user <= 0 ||
            !Array.isArray(products)
        ) {
            throw new Err(HttpCode.E400, 'invalid user id or product id', null)
        }

        let res: IdChecks[] = []

        try {
            //获取和验证user id对应的object
            let temp = await OrderController.checkIdExits([user], UserController.repo)
            if (temp.index !== -1) {
                throw new Err(HttpCode.E400, `invalid user id: ${temp.index}`, null)
            }
            res.push(temp)
            //获取和验证product id对应的object
            temp = await OrderController.checkIdExits(products, ProductController.repo)
            if (temp.index !== -1) {
                throw new Err(HttpCode.E400, `invalid user id: ${temp.index}`, null)
            }
            res.push(temp)
        } catch (error) {
            throw new Err(HttpCode.E400, `invalid user id or product id`, null)
        }
        return res
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        //user和products传过来的都是id
        let {price, taxRate, total, user, products} = request.body

        let order = new Order()
        order.taxRate = taxRate
        order.price = price
        order.total = total

        //user id => object {}
        //product id => products, []
        try {
            const errors = await validate(order)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorMissingParameter, errors))
            }

            let res = await OrderController.validateOrder(user, products)
            //人为的把user放入了数组所以只取entities的第0个
            order.user = res[0].entities[0]
            order.products = res[1].entities

            //保存order
            await OrderController.repo.save(order)

        } catch (error) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrorStore, error))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }

    static async update(request: Request, response: Response, next: NextFunction) {
    }

    static async delete(request: Request, response: Response, next: NextFunction) {

    }

}