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

function ProductsPage(props) {
  // Todo:  state
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [productList, setProductList] = useState([])
  const [created, setCreated] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [filters, setFilter] = useState(() => {
    if (location.search) {
      return {
        _page: +searchParams.get('page') || 1,
        _limit: 2,
        _q: searchParams.get('q') || '',
        _status: searchParams.get('status') || 'ACTIVE',
      }
    } else {
      return {
        _page: 1,
        _limit: 2,
        _q: '',
        _status: 'ACTIVE',
      }
    }
  })
  const [pagination, setPagination] = useState({
    limit: 5,
    page: 1,
    totalItems: 1,
    totalPages: 1,
  })

  useEffect(() => {
    const queryParams = {
      page: filters._page,
      limit: filters._limit,
      q: filters._q,
      status: filters._status,
    }

    setSearchParams(queryParams)
  }, [location.search])

  const getProductList = async () => {
    try {
      const queryParams = {
        page: filters._page,
        limit: filters._limit,
        q: filters._q,
        status: filters._status,
      }

      const res = await productApi.find(queryParams)
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
    setFilter((prevState) => ({
      ...prevState,
      _page: page,
    }))
    setSearchParams('page', page)
  }

  useEffect(() => {
    getProductList({})
  }, [filters])

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

  const handleSubmit = async (formData) => {
    try {
      let res = null
      if (created?.id) {
        // mode update

        res = await productApi.update(created.id, formData)
      } else {
        // mode create
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
                    page={filters._page || 1}
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
