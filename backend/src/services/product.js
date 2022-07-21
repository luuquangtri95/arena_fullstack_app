import CloudinaryUploader from '../connector/cloudinary/index.js'
import Repository from './../repositories/product.js'

export default {
  count: async (req) => {
    try {
      return await Repository.count()
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  find: async (req) => {
    try {
      const { page, limit, ...rest } = req.query

      let _page = parseInt(page) >= 1 ? parseInt(page) : 1
      let _limit = parseInt(limit) >= 0 ? parseInt(limit) : 20

      console.log('rest', rest)

      return await Repository.find({ page: _page, limit: _limit, rest })
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  findById: async (req) => {
    try {
      const { id } = req.params

      return await Repository.findById(id)
    } catch (error) {
      throw error
    }
  },

  create: async (req) => {
    try {
      let data = { ...req.body }

      return await Repository.create(data)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  update: async (req) => {
    try {
      let data = { ...req.body }
      let { id } = req.params

      return await Repository.update(id, data)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  delete: async (req) => {
    try {
      const { id } = req.params

      return await Repository.delete(id)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
