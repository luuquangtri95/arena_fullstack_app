import axiosClient from '../helpers/axiosClient.js'

const productApi = {
  getCount() {
    const url = '/api/products/count'
    return axiosClient.get(url)
  },
  find(params) {
    const url = '/api/products'
    return axiosClient.get(url, { params })
  },

  findById(id) {
    const url = `/api/products/${id}`
    return axiosClient.get(url)
  },

  create(data) {
    const url = '/api/products'
    return axiosClient.post(url, data)
  },

  update(id, data) {
    const url = `/api/products/${id}`
    return axiosClient.put(url, data)
  },

  _delete(id) {
    const url = `/api/products/${id}`
    return axiosClient.delete(url)
  },
}

export default productApi
