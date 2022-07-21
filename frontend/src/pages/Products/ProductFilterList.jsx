import { Card, Stack } from '@shopify/polaris'
import React from 'react'
import FilterByRangePrice from './filterList/FilterByRangePrice'
import FilterByStatus from './filterList/FilterByStatus'
import FilterByVendor from './filterList/FilterByVendor'

function ProductFilterList({ filters = {}, onChange = null }) {
  const handleFilterChange = (values) => {
    const newFilters = {
      ...filters,
      ...values,
    }

    onChange?.(newFilters)
  }

  return (
    <Card>
      <Stack>
        <FilterByStatus filters={filters} onChange={handleFilterChange} />
        <FilterByVendor filters={filters} onChange={handleFilterChange} />
        <FilterByRangePrice onChange={handleFilterChange} />
      </Stack>
    </Card>
  )
}

export default ProductFilterList
