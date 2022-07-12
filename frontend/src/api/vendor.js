import axiosClient from '../helpers/axiosClient.js'

const vendorApi = {
  find() {
    const url = '/api/vendors'
    return axiosClient.get(url)
  },
}

export default vendorApi
