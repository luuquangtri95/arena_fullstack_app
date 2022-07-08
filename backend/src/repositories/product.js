import Model from '../models/product.js'

export default {
  count: async () => {
    try {
      return await Model.count()
    } catch (error) {
      throw error
    }
  },

  find: async ({ page, limit }) => {
    try {
      const count = await Model.count()
      const items = await Model.findAll({
        limit,
        offset: (page - 1) * limit,
        include,
        order: [['updatedAt', 'DESC']],
      })

      return {
        items,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      }
    } catch (error) {
      throw error
    }
  },

  findById: async (id) => {
    try {
      const res = await Model.findOne({
        where: { id },
        include,
      })
      if (!res) {
        throw new Error('Not found')
      }

      return res
    } catch (error) {
      throw error
    }
  },

  create: async (data) => {
    try {
      // generate password encode
      const salt = bcrypt.genSaltSync(10)
      const passwordEncode = bcrypt.hashSync(data.password, salt)
      data.password = passwordEncode

      return await Model.create(data)
    } catch (error) {
      throw error
    }
  },

  update: async (id, data) => {
    try {
      const entry = await Model.findOne({
        where: { id },
        include,
      })
      if (!entry) {
        throw new Error('Not found')
      }

      // cannot allow update specific fields
      delete data.role

      await Model.update(data, {
        where: { id },
        returning: true,
        plain: true,
        include,
      })

      return await Model.findOne({
        where: { id },
        include,
      })
    } catch (error) {
      throw error
    }
  },

  delete: async (id) => {
    try {
      let entry = await Model.findOne({ where: { id } })
      if (!entry) {
        throw new Error('Not found')
      }

      return await Model.destroy({ where: { id } })
    } catch (error) {
      throw error
    }
  },
}
