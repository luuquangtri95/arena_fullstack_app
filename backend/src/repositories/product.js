import generateSlug from '../helpers/generateSlug.js'
import Model from '../models/product.js'
import ModelVendor from '../models/vendor.js'

const include = [{ model: ModelVendor, as: 'vendor' }]

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
      const dataMappingHandleField = {
        ...data,
        handle: generateSlug(data.title, Date.now()),
      }
      return await Model.create(dataMappingHandleField)
    } catch (error) {
      throw error
    }
  },

  update: async (id, data) => {
    try {
      const entry = await Model.findOne({
        where: { id },
        include,
        raw: true,
      })

      if (!entry) {
        throw new Error('Not found')
      }

      const dataUpdated = {
        ...data,
        images: [...entry.images, ...data.images],
      }

      await Model.update(dataUpdated, {
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
