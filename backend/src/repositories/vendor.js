import Model from '../models/vendor.js'

export default {
  async find() {
    try {
      return await Model.findAll()
    } catch (error) {
      throw error
    }
  },
}
