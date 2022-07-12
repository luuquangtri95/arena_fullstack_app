import PropTypes from 'prop-types'
import { Button, Card, Stack, TextField } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import FormControl from '../../components/FormControl'
import FormValidate from '../../helpers/formValidate'
import MyDropZone from '../../components/MyDropZoneSingle'

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
    label: 'title',
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
    label: 'description',
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

  vendorId: {
    type: 'select',
    label: 'Vendor',
    value: '',
    error: '',
    validate: {},
    options: [{ label: 'Select a vendor', value: '' }],
  },

  images: {
    type: 'file',
    label: 'Photos',
    value: [],
    error: '',
    validate: {},
    allowMultiple: true,
  },
}

function CreateForm(props) {
  const { actions, created, onDiscard, onSubmit, vendor } = props

  const [formData, setFormData] = useState(initialFormData)

  console.log('create form >>', vendor)

  useEffect(() => {
    let _formData = JSON.parse(JSON.stringify(initialFormData))

    if (vendor) {
      let vendorOptions = vendor.map((item) => ({ label: item.name, value: '' + item.id }))
      vendorOptions.unshift({ label: 'Select a vendor', value: '' })

      _formData.vendorId = { ..._formData.vendorId, options: vendorOptions }
    }

    // if (created.id) {
    //   Array.from(['firstName', 'lastName', 'username', 'email', 'birthday', 'countryId']).map(
    //     (key) => (_formData[key] = { ..._formData[key], value: String(created[key] || '') }),
    //   )
    //   Array.from(['gender']).map(
    //     (key) => (_formData[key] = { ..._formData[key], value: Boolean(created[key] || '') }),
    //   )

    //   delete _formData.password
    //   delete _formData.confirmPassword
    // }

    setFormData(_formData)
  }, [])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleSubmit = () => {
    try {
      const { valid, data } = FormValidate.validateForm(formData)

      if (valid) {
        // validate password and confirmPassword matched
        onSubmit(data)
      } else {
        setFormData(data)

        throw new Error('Invalid form data')
      }
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
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
                    {...formData['vendorId']}
                    onChange={(value) => handleChange('vendorId', value)}
                  />
                </Stack.Item>
                <Stack.Item fill></Stack.Item>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <Stack>
                <Stack.Item fill>
                  <FormControl
                    {...formData['photos']}
                    onChange={(value) => handleChange('photos', value)}
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
