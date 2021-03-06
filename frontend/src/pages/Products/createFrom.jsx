import PropTypes from 'prop-types'
import { Button, Card, Grid, Icon, Key, Page, Stack, TextField } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import FormControl from '../../components/FormControl'
import FormValidate from '../../helpers/formValidate'
import MyDropZone from '../../components/MyDropZoneSingle'
import { CircleCancelMajor } from '@shopify/polaris-icons'

CreateForm.propTypes = {
  created: PropTypes.object,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
  vendor: PropTypes.array,
}

CreateForm.defaultProps = {
  created: {},
  onDiscard: () => null,
  onSubmit: () => null,
  vendor: [],
}

const initialFormData = {
  title: {
    type: 'text',
    label: 'Title',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [20, 'Too long!'],
    },
    autoFocus: true,
  },

  description: {
    type: 'text',
    label: 'Description',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [20, 'Too long!'],
    },
  },

  price: {
    type: 'number',
    label: 'Price',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [20, 'Too long!'],
    },
  },
  status: {
    type: 'select',
    label: 'Status',
    value: '',
    error: '',
    validate: {},
    options: [
      {
        label: 'ACTIVE',
        value: 'ACTIVE',
      },
      {
        label: 'DRAFT',
        value: 'DRAFT',
      },
      {
        label: 'ARCHIVED',
        value: 'ARCHIVED',
      },
    ],
  },

  thumbnail: {
    type: 'file',
    label: 'Thumbnail',
    value: null,
    error: '',
    validate: {},
    allowMultiple: false,
  },

  images: {
    type: 'file',
    label: 'Images Products',
    value: [],
    originValue: [],
    error: '',
    validate: {},
    allowMultiple: true,
  },

  vendorId: {
    type: 'select',
    label: 'Vendor',
    value: '',
    error: '',
    validate: {},
    options: [{ label: 'Select a vendor', value: '' }],
  },
}

function CreateForm(props) {
  const { created, onDiscard, onSubmit, vendor } = props
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    let _formData = JSON.parse(JSON.stringify(initialFormData))

    /**
     * test
     */
    // _formData.title.value = 'iphone 12 promax' + Date.now()
    // _formData.description.value = 'pham'
    // _formData.price.value = 12345
    // _formData.vendorId.value = '1'

    if (vendor.length) {
      let vendorOptions = vendor.map((item) => ({ label: item.name, value: String(item.id) }))

      vendorOptions.unshift({ label: 'Select a vendor', value: '' })

      _formData.vendorId = { ..._formData.vendorId, options: vendorOptions }
    }

    if (created.id) {
      Array.from(['title', 'description', 'price', 'vendorId', 'status']).map(
        (key) => (_formData[key] = { ..._formData[key], value: String(created[key] || '') }),
      )

      Array.from(['thumbnail', 'images']).map(
        (key) => (_formData[key] = { ..._formData[key], value: created[key] }),
      )

      _formData.images.originValue = _formData.images.value
    }

    setFormData(_formData)
  }, [])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    Array.from(['thumbnail', 'images']).forEach((key) => (_formData[key] = formData[key]))

    _formData[name] = { ..._formData[name], value, error: '' }

    setFormData(_formData)
  }

  const handleRemoveThumbnail = () => {
    let _formData = JSON.parse(JSON.stringify(formData))

    _formData.thumbnail.value = ''

    setFormData(_formData)
  }

  const handleRemoveImages = (idx) => {
    let _formData = JSON.parse(JSON.stringify(formData))

    _formData.images.originValue.splice(idx, 1)

    console.log('_formData', _formData)

    setFormData(_formData)
  }

  const handleSubmit = () => {
    try {
      const { valid, data } = FormValidate.validateForm(formData)

      if (valid) {
        data['images'].value = formData['images'].value
        data['thumbnail'].value = formData['thumbnail'].value

        const mapData = {
          title: data.title.value,
          description: data.description.value,
          handle: data.title.value,
          price: +data.price.value,
          thumbnail: data.thumbnail.value,
          images: data.images.value,
          status: data.status.value || 'ACTIVE',
          vendorId: data.vendorId.value,
          originImages: data.images.originValue,
        }

        onSubmit(mapData)
      } else {
        setFormData(data)

        throw new Error('Invalid form data')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Stack vertical alignment="fill">
      <Stack.Item>
        <AppHeader title={created.id ? 'Edit product' : 'Add product'} onBack={onDiscard} />
      </Stack.Item>

      <Stack.Item>
        <Card sectioned>
          <Stack vertical alignment="fill">
            <Stack.Item>
              <Stack>
                <Stack.Item fill>
                  <FormControl
                    {...formData['title']}
                    onChange={(value) => handleChange('title', value)}
                  />
                </Stack.Item>

                <Stack.Item fill>
                  <FormControl
                    {...formData['price']}
                    onChange={(value) => handleChange('price', value)}
                  />
                </Stack.Item>
              </Stack>
            </Stack.Item>

            <Stack.Item>
              <Stack>
                <Stack.Item fill>
                  <FormControl
                    {...formData['description']}
                    onChange={(value) => handleChange('description', value)}
                  />
                </Stack.Item>
              </Stack>
            </Stack.Item>

            <Stack.Item>
              <Stack>
                <Stack.Item fill>
                  <FormControl
                    {...formData['status']}
                    onChange={(value) => handleChange('status', value)}
                  />
                </Stack.Item>
                <Stack.Item fill>
                  <FormControl
                    {...formData['vendorId']}
                    onChange={(value) => handleChange('vendorId', value)}
                  />
                </Stack.Item>
              </Stack>
            </Stack.Item>

            {created.id && (
              <Stack.Item>
                <Stack>
                  <Stack.Item fill>
                    {formData.thumbnail.value && (
                      <div className="image-pos">
                        <img src={formData.thumbnail.value} alt="" />
                        <div className="icon-cancel" onClick={handleRemoveThumbnail}>
                          <Icon source={CircleCancelMajor} color="base" />
                        </div>
                      </div>
                    )}

                    {!formData.thumbnail.value && <span>No image</span>}
                  </Stack.Item>

                  <Stack.Item fill>
                    {formData.images.originValue.map((image, index) => (
                      <div className="image-pos" key={index}>
                        <img src={image} alt="" />
                        <div className="icon-cancel" onClick={() => handleRemoveImages(index)}>
                          <Icon source={CircleCancelMajor} color="base" />
                        </div>
                      </div>
                    ))}

                    {formData.images.originValue.length < 1 && <span>No Images</span>}
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            )}

            <Stack.Item>
              <Stack>
                <Stack.Item fill>
                  <FormControl
                    {...formData['thumbnail']}
                    onChange={(value) => handleChange('thumbnail', value)}
                  />
                </Stack.Item>
                <Stack.Item fill>
                  <FormControl
                    {...formData['images']}
                    onChange={(value) => handleChange('images', value)}
                  />
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
        </Card>
      </Stack.Item>

      <Stack.Item>
        <Stack distribution="trailing">
          <Button onClick={onDiscard}>Discard</Button>
          <Button primary onClick={handleSubmit}>
            {created.id ? 'Save' : 'Add'}
          </Button>
        </Stack>
      </Stack.Item>
    </Stack>
  )
}

export default CreateForm
