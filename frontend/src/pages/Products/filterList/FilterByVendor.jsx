import { Select } from '@shopify/polaris'
import React, { useState } from 'react'

function FilterByVendor({ onChange = null, filters = {} }) {
  const [selected, setSeleted] = useState(filters.vendorId)

  const options = [
    { label: 'All', value: '' },
    { label: 'Apple', value: '1' },
    { label: 'Samsung', value: '2' },
  ]

  const handleSelectChange = (value) => {
    setSeleted(value)
    onChange({ vendorId: value })
  }

  return (
    <Select
      label="Filter By Vendor"
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
  )
}

export default FilterByVendor
