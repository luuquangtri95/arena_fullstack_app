import { Button, Card, RangeSlider, Stack, TextField } from '@shopify/polaris'
import React, { useState } from 'react'

function FilterByRangePrice({ onChange = null, filters = {} }) {
  const initialValue = [900, 1000]
  const prefix = 'VNĐ'
  const min = 100000
  const max = 3000000
  const step = 100

  const [intermediateTextFieldValue, setIntermediateTextFieldValue] = useState(initialValue)
  const [rangeValue, setRangeValue] = useState(initialValue)

  const handleRangeSliderChange = (value) => {
    setRangeValue(value)
    setIntermediateTextFieldValue(value)
  }

  const handleLowerTextFieldChange = (value) => {
    const upperValue = rangeValue[1]
    setIntermediateTextFieldValue([parseInt(value, 10), upperValue])
  }

  const handleUpperTextFieldChange = (value) => {
    const lowerValue = rangeValue[0]
    setIntermediateTextFieldValue([lowerValue, parseInt(value, 10)])
  }

  const handleLowerTextFieldBlur = () => {
    const upperValue = rangeValue[1]
    const value = intermediateTextFieldValue[0]

    setRangeValue([parseInt(value, 10), upperValue])
  }

  const handleUpperTextFieldBlur = () => {
    const lowerValue = rangeValue[0]
    const value = intermediateTextFieldValue[1]

    setRangeValue([lowerValue, parseInt(value, 10)])
  }

  const lowerTextFieldValue =
    intermediateTextFieldValue[0] === rangeValue[0] ? rangeValue[0] : intermediateTextFieldValue[0]

  const upperTextFieldValue =
    intermediateTextFieldValue[1] === rangeValue[1] ? rangeValue[1] : intermediateTextFieldValue[1]

  const handleSubmit = () => {
    onChange({ price_gte: rangeValue[0], price_lte: rangeValue[1] })
  }

  return (
    <div>
      <RangeSlider
        output
        label="Filter By Range Price"
        value={rangeValue}
        prefix={prefix}
        min={min}
        max={max}
        step={step}
        onChange={handleRangeSliderChange}
      />
      <Stack distribution="equalSpacing" spacing="extraLoose">
        <TextField
          label="Min"
          type="number"
          value={`${lowerTextFieldValue}`}
          prefix={prefix}
          min={min}
          max={max}
          step={step}
          onChange={handleLowerTextFieldChange}
          onBlur={handleLowerTextFieldBlur}
          autoComplete="off"
        />
        <TextField
          label="Max"
          type="number"
          value={`${upperTextFieldValue}`}
          prefix={prefix}
          min={min}
          max={max}
          step={step}
          onChange={handleUpperTextFieldChange}
          onBlur={handleUpperTextFieldBlur}
          autoComplete="off"
        />
      </Stack>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}

export default FilterByRangePrice
