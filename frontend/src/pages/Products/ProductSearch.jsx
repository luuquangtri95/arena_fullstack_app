import { TextField } from '@shopify/polaris'
import React, { useRef, useState } from 'react'

function ProductSearch({ filters = {}, onChange = null }) {
  const [search, setSearch] = useState(filters.q)
  const typingTimeoutRef = useRef(null)

  const handleCSearchWithDebounce = (value) => {
    setSearch(value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setSearch(value)

      onChange({ q: value })
    }, 500)
  }

  const handleClearButtonClick = () => {
    setSearch('')

    onChange({ q: '' })
  }

  return (
    <TextField
      label="Search by title or description"
      value={search}
      onChange={(value) => handleCSearchWithDebounce(value)}
      onClearButtonClick={handleClearButtonClick}
      autoComplete="off"
      clearButton
    />
  )
}

export default ProductSearch
