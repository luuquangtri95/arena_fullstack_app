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
    const formData = new FormData()
    Object.keys(data)
      .filter((name) => !['images', 'thumbnail'].includes(name))
      .forEach((name) => formData.append(name, data[name]))

    if (data.images?.length) {
      data.images.forEach((item) => formData.append('images', item))
    }

    formData.append('thumbnail', data.thumbnail)

    const url = '/api/products'
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(id, data) {
    const formData = new FormData()
    Object.keys(data)
      .filter((name) => !['images', 'thumbnail'].includes(name))
      .forEach((name) => formData.append(name, data[name]))

    if (data.images?.length) {
      data.images.forEach((item) => formData.append('images', item))
    }

    formData.append('thumbnail', data.thumbnail)

    const url = `/api/products/${id}`
    return axiosClient.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  _delete(id) {
    const url = `/api/products/${id}`
    return axiosClient.delete(url)
  },
}

export default productApi
