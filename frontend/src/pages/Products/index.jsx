import { Card, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import productApi from '../../api/productApi'
import vendorApi from '../../api/vendor'
import AppHeader from '../../components/AppHeader'
import MyPagination from '../../components/MyPagination'
import ConfirmDelete from '../Products/ConfirmDelete'
import Table from '../Products/Table'
import CreateForm from './createFrom'
import { useLocation, useSearchParams } from 'react-router-dom'
import uploadApi from '../../api/uploadApi'
import ProductFilterList from './ProductFilterList'
import queryString from 'query-string'

function ProductsPage(props) {
  // Todo:  state
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const queryParams = queryString.parse(location.search)
  console.log('queryParams', queryParams)
  const [productList, setProductList] = useState([])
  const [created, setCreated] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [filters, setFilters] = useState(() => ({
    ...queryParams,
    page: Number.parseInt(queryParams.page) || 1,
    limit: Number.parseInt(queryParams.limit) || 2,
  }))

  const [pagination, setPagination] = useState({
    limit: 5,
    page: 1,
    totalItems: 1,
    totalPages: 1,
  })

  useEffect(() => {
    setSearchParams(filters)
  }, [location.search])

  const getProductList = async () => {
    try {
      const res = await productApi.find(filters)
      const { items, limit, page, totalItems, totalPages } = res.data

      setProductList(items)
      setPagination((prevState) => ({
        ...prevState,
        limit,
        page,
        totalItems,
        totalPages,
      }))
    } catch (error) {
      console.log('fetch to fail', error.message)
    }
  }

  const handlePageChange = (page, limit) => {
    setFilters((prevState) => ({
      ...prevState,
      page: page,
    }))
    setSearchParams('page', page)
  }

  useEffect(() => {
    getProductList({})
  }, [filters, location.search])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await vendorApi.find()
        const { data } = res

        setVendor(data)
      } catch (error) {
        console.log('fetch to fail', error.message)
      }
    })()
  }, [])

  const handleFilterChange = (newFilter) => {
    setFilters((prevState) => ({
      ...prevState,
      status: newFilter.status,
    }))

    setSearchParams(newFilter)
    setPagination((prevState) => ({
      ...prevState,
      page: 1,
    }))
  }

  const handleSubmit = async (formData) => {
    try {
      let res = null
      if (created?.id) {
        // mode update
        res = await productApi.update(created.id, formData)
      } else {
        // mode create
        if (formData.images?.length > 0) {
          let response = await uploadApi.upload(formData.images)

          formData.images = [...response.data.images]
        }

        if (formData?.thumbnail) {
          let response = await uploadApi.upload(formData.thumbnail)

          formData.thumbnail = response.data.images[0]
        }

        res = await productApi.create(formData)
      }

      if (!res.success) {
        throw res.error
      }
      setCreated(null)
      getProductList([])
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      let res = await productApi._delete(deleted.id)

      if (!res.success) {
        throw res.error
      }
      setDeleted(null)
      getProductList({ page: filters._page, limit: filters._limit })
    } catch (error) {
      console.log(error)
    }
  }

  if (created) {
    return (
      <CreateForm
        {...props}
        created={created}
        onDiscard={() => setCreated(null)}
        onSubmit={(formData) => handleSubmit(formData)}
        vendor={vendor}
      />
    )
  }

  return (
    <div>
      <>
        <Stack vertical alignment="fill">
          <Stack.Item>
            <AppHeader
              title="Products"
              actions={[
                {
                  label: 'Add user',
                  primary: true,
                  onClick: () => setCreated({}),
                },
              ]}
            />
          </Stack.Item>

          <Stack.Item>
            <ProductFilterList filters={filters} onChange={handleFilterChange} />
          </Stack.Item>

          <Stack.Item>
            <Card sectioned>
              <Stack vertical fill>
                <Stack.Item>
                  <div>
                    Total items: <b>{pagination.totalItems}</b>
                  </div>
                </Stack.Item>

                <Stack.Item>
                  <Table
                    {...props}
                    productList={productList}
                    onEdit={(item) => setCreated(item)}
                    onDelete={(item) => setDeleted(item)}
                  />
                </Stack.Item>

                <Stack.Item>
                  <MyPagination
                    page={+filters.page}
                    limit={pagination.limit}
                    totalPages={pagination.totalPages}
                    onChange={({ page, limit }) => handlePageChange(page, limit)}
                  />
                </Stack.Item>
              </Stack>
            </Card>
          </Stack.Item>
        </Stack>

        {deleted && <ConfirmDelete onDiscard={() => setDeleted(null)} onSubmit={handleDelete} />}
      </>
    </div>
  )
}

export default ProductsPage
