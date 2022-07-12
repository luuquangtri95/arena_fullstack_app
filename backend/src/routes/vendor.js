import express from 'express'
import Controller from '../controllers/vendor.js'

const router = express.Router()

router.get('/', Controller.find)

export default router
