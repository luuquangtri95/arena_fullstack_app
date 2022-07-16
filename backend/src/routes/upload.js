import express from 'express'
import CloudinaryUploader from '../connector/cloudinary/index.js'
import ResponseHandler from '../helpers/responseHandler.js'
import MulterUpload from './../connector/multer/index.js'

const router = express.Router()

router.post('/', MulterUpload.fields([{ name: 'images', maxCount: 10 }]), async (req, res) => {
  try {
    let images = []

    if (req.files.images) {
      // upload to cloudinary

      let files = []
      for (let i = 0; i < req.files.images.length; i++) {
        let file = await CloudinaryUploader.upload(req.files.images[i])

        files.push(file)
      }

      images = files.map((item) => item.secure_url)
    } else {
      images = []
    }

    return ResponseHandler.success(res, { images })
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

export default router
