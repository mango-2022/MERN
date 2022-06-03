import {Router} from 'express';
import {ProductController} from "../controller/ProductController";

const router = Router()
// router.get('/', (req, res) => {
//     return res.send('all products list')
// })

router.get('/', ProductController.all)
router.get('/:productId', ProductController.one)
router.post('/', ProductController.create)
router.put('/:productId', ProductController.update)
router.delete('/:productId', ProductController.delete)

export default router