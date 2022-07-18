import express from 'express'
import Controller from '../controllers/product.js'
import ProductValidate from './../validator/product.js'

const router = express.Router()

router.get('/', Controller.find)
router.get('/:id', Controller.findById)
router.get('/count', Controller.count)
router.post('/', ProductValidate.create, Controller.create)
router.put('/:id', ProductValidate.update, Controller.update)
router.delete('/:id', Controller.delete)

export default router
