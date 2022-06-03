import {Router} from 'express';
import {UserController} from "../controller/UserController";

const router = Router()
// router.get('/', (req, res) => {
//     return res.send('all products list')
// })

router.get('/', UserController.all)
router.get('/:userId', UserController.one)
router.post('/', UserController.create)
router.put('/:userId', UserController.update)
router.delete('/:userId', UserController.delete)

export default router