import React from 'react'
import { Stack } from '@shopify/polaris'
import FilterByStatus from './filterList/FilterByStatus'
import FilterByVendor from './filterList/FilterByVendor'
import FilterByRangePrice from './filterList/FilterByRangePrice'

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
      <FilterByVendor filters={filters} onChange={handleFilterChange} />
      <FilterByRangePrice onChange={handleFilterChange} />
    </Stack>
  )
}

export default ProductFilterList
