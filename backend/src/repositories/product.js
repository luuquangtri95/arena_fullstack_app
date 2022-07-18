import generateSlug from '../helpers/generateSlug.js'
import Model from '../models/product.js'
import ModelVendor from '../models/vendor.js'
import { Op } from 'sequelize'

const include = [{ model: ModelVendor, as: 'vendor' }]

export default {
  count: async () => {
    try {
      return await Model.count()
    } catch (error) {
      throw error
    }
  },

  find: async ({ page, limit, rest }) => {
    try {
      const count = await Model.count()
      let items = []

      if (Object.keys(rest).length > 0) {
        items = await Model.findAll({
          where: {
            status: rest.status,
            // [Op.or]: [
            //   {
            //     title: {
            //       [Op.like]: `%${rest.q}%`,
            //     },
            //   },
            //   {
            //     description: {
            //       [Op.like]: `%${rest.q}%`,
            //     },
            //   },
            // ],
          },
          limit,
          offset: (page - 1) * limit,
          include,
          order: [['updatedAt', 'DESC']],
        })
      } else {
        items = await Model.findAll({
          limit,
          offset: (page - 1) * limit,
          include,
          order: [['updatedAt', 'DESC']],
        })
      }

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
      const dataMappingHandleField = {
        ...data,
        handle: generateSlug(data.title, Date.now()),
      }

      const entry = await Model.findOne({
        where: { id },
        include,
        raw: true,
      })
      if (!entry) {
        throw new Error('Not found')
      }
      await Model.update(dataMappingHandleField, {
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
