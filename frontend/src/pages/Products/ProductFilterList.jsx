import React from 'react'
import { Stack } from '@shopify/polaris'
import FilterByStatus from './filterList/FilterByStatus'

function ProductFilterList({ filters = {}, onChange = null }) {
  const handleFilterChange = (values) => {
    const newFilters = {
      ...filters,
      ...values,
    }

    onChange?.(newFilters)
  }

  return (
    <Stack>
      <FilterByStatus filters={filters} onChange={handleFilterChange} />
    </Stack>
  )
}

export default ProductFilterList
