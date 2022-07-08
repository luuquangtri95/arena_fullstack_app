import express from 'express'
import Controller from '../controllers/product.js'
const router = express.Router()

router.get('/', Controller.findAll)
router.get('/:id', Controller.findById)
router.post('/', Controller.create)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)

export default router
