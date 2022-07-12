import Repository from './../repositories/vendor.js'

export default {
  async find() {
    try {
      return await Repository.find()
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
