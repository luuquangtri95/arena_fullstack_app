import {
  ChoiceList,
  TextField,
  Card,
  Filters,
  DataTable,
  Stack,
  Avatar,
  Thumbnail,
  Popover,
  Button,
  ActionList,
} from '@shopify/polaris'
import { MobileVerticalDotsMajor } from '@shopify/polaris-icons'
import { useState, useCallback } from 'react'

function TableClone(props) {
  const { productList, onEdit, onDelete } = props
  const [selected, setSelected] = useState(null)
  const [availability, setAvailability] = useState(null)
  const [productType, setProductType] = useState(null)
  const [taggedWith, setTaggedWith] = useState(null)
  const [queryValue, setQueryValue] = useState(null)
  let rows = []

  if (productList.length) {
    rows = productList.map((item, index) => [
      index + 1,
      <Stack vertical spacing="extraTight">
        <Stack.Item>
          <Stack spacing="tight" wrap={false}>
            <Stack.Item>
              <Avatar alt={item.thumbnail} src={item.thumbnail} size="3em" />
            </Stack.Item>
            <Stack.Item>
              <p>
                <b>{item.title}</b>
              </p>
              <p>
                <i>{item.description}</i>
              </p>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <Stack spacing="extraTight">
            {item.images?.length > 0 &&
              item.images.map((_item, _index) => (
                <Stack.Item key={_index}>
                  <Thumbnail alt="" source={_item} size="small" />
                </Stack.Item>
              ))}
          </Stack>
        </Stack.Item>
      </Stack>,

      <Stack vertical spacing="extraTight">
        <Stack.Item>Title: {item?.title}</Stack.Item>
        <Stack.Item>description: {item?.description}</Stack.Item>
        <Stack.Item>Price: {item?.price}</Stack.Item>
        <Stack.Item>url SEO: {item?.handle}</Stack.Item>
        <Stack.Item>vendor: {item?.vendor.name}</Stack.Item>
        <Stack.Item>status: {item?.status}</Stack.Item>
      </Stack>,

      <Popover
        active={item.id === selected?.id}
        activator={
          <Button
            onClick={() => setSelected(selected?.id === item.id ? null : item)}
            icon={MobileVerticalDotsMajor}
            outline
          ></Button>
        }
        onClose={() => setSelected(null)}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: 'Preview',
              onAction: () => {
                setSelected(null)
              },
            },
            {
              content: 'Edit',
              onAction: () => {
                onEdit(item)
                setSelected(null)
              },
            },
            {
              content: 'Delete',
              onAction: () => {
                onDelete(item)
                setSelected(null)
              },
            },
          ]}
        />
      </Popover>,
    ])
  }

  const handleAvailabilityChange = useCallback((value) => setAvailability(value), [])
  const handleProductTypeChange = useCallback((value) => setProductType(value), [])
  const handleTaggedWithChange = useCallback((value) => setTaggedWith(value), [])
  const handleFiltersQueryChange = useCallback((value) => setQueryValue(value), [])
  const handleAvailabilityRemove = useCallback(() => setAvailability(null), [])
  const handleProductTypeRemove = useCallback(() => setProductType(null), [])
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), [])
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), [])
  const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove()
    handleProductTypeRemove()
    handleTaggedWithRemove()
    handleQueryValueRemove()
  }, [
    handleAvailabilityRemove,
    handleQueryValueRemove,
    handleProductTypeRemove,
    handleTaggedWithRemove,
  ])

  const filters = [
    {
      key: 'availability',
      label: 'Availability',
      filter: (
        <ChoiceList
          title="Availability"
          titleHidden
          choices={[
            { label: 'Online Store', value: 'Online Store' },
            { label: 'Point of Sale', value: 'Point of Sale' },
            { label: 'Buy Button', value: 'Buy Button' },
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'productType',
      label: 'Product type',
      filter: (
        <ChoiceList
          title="Product type"
          titleHidden
          choices={[
            { label: 'T-Shirt', value: 'T-Shirt' },
            { label: 'Accessory', value: 'Accessory' },
            { label: 'Gift card', value: 'Gift card' },
          ]}
          selected={productType || []}
          onChange={handleProductTypeChange}
          allowMultiple
        />
      ),
    },
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
    },
  ]

  const appliedFilters = []
  if (!isEmpty(availability)) {
    const key = 'availability'
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    })
  }
  if (!isEmpty(productType)) {
    const key = 'productType'
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, productType),
      onRemove: handleProductTypeRemove,
    })
  }
  if (!isEmpty(taggedWith)) {
    const key = 'taggedWith'
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    })
  }

  return (
    <div style={{ height: '568px' }}>
      <Card>
        <Card.Section>
          <Filters
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleFiltersClearAll}
          />
        </Card.Section>
        <DataTable
          columnContentTypes={['text', 'text', 'text', , 'text']}
          headings={['No.', 'Products', 'Advanced', 'Action']}
          rows={rows}
        />
      </Card>
    </div>
  )

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith':
        return `Tagged with ${value}`
      case 'availability':
        return value.map((val) => `Available on ${val}`).join(', ')
      case 'productType':
        return value.join(', ')
      default:
        return value
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0
    } else {
      return value === '' || value == null
    }
  }
}

export default TableClone
