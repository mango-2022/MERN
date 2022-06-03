import {Router} from 'express';
import {OrderController} from "../controller/OrderController";

const router = Router()

router.get('/', OrderController.all)
router.get('/:orderId', OrderController.one)
router.post('/', OrderController.create)
router.put('/:orderId', OrderController.update)
router.delete('/:orderId', OrderController.delete)

export default router

// router.get('/', (req, res) => {
//     return res.send('all orders list')
// })

// router.post('/', (req, res) => {
//     //query
// })
// router.get('/:orderId/:paymentStatus', (req, res) =>{
//     //params, headers, query, body
//     const {orderId, paymentStatus} = req.params
//     // const {name, age} = req.query
//     const {token, did} = req.headers
//     let msg = `order id : ${orderId}, payment status: ${paymentStatus}`
//     let msg2 = `token : ${token}, device: ${did}`
//
//     let userInfo = {
//         name: 'john',
//         age: '20',
//         address: 'Toronto, ON',
//         education: {
//             primary: 'beijing'
//         }
//     }
//     //设置系统header
//     res.setHeader('Content-Type', 'application/json')
//     //人为改写
//     res.setHeader('X-Powered-By', 'mango2022')
//     //自定义header
//     res.setHeader('lastVisit', '2025/01/02/12:33:33')
//
//     console.log(msg + msg2)
//     return res.json(userInfo)
// })

