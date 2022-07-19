import { Select } from '@shopify/polaris'
import React from 'react'
import { useState } from 'react'

function FilterByStatus({ onChange = null, filters }) {
  const [selected, setSeleted] = useState(filters.status)

  const options = [
    { label: 'ALL', value: '' },
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'DRAFT', value: 'DRAFT' },
    { label: 'ARCHIVED', value: 'ARCHIVED' },
  ]

  const handleSelectChange = (value) => {
    setSeleted(value)
    onChange({ status: value })
  }

  return (
    <Select
      label="Filter By Status"
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
  )
}

export default FilterByStatus
