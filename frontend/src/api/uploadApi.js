import axiosClient from '../helpers/axiosClient.js'

const uploadApi = {
  upload(data) {
    console.log('data :>> ', data)
    const formData = new FormData()
    const url = '/api/upload'

    if (data?.length > 0) {
      data.forEach((image) => formData.append('images', image))
    } else {
      formData.append('images', data)
    }

    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default uploadApi
