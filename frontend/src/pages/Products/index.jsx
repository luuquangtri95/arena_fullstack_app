import { Card, Stack } from '@shopify/polaris'
import { useEffect } from 'react'
import { useState } from 'react'
import productApi from '../../api/productApi'
import vendorApi from '../../api/vendor'
import AppHeader from '../../components/AppHeader'
import MyPagination from '../../components/MyPagination'
import CreateForm from './createFrom'
import Table from '../Products/Table'
import ConfirmDelete from '../Products/ConfirmDelete'

function ProductsPage(props) {
  const [filters, setFilter] = useState({
    _page: 1,
    _limit: 5,
    search: '',
  })
  const [productList, setProductList] = useState([])
  const [pagination, setPagination] = useState({
    limit: 5,
    page: 1,
    totalItems: 1,
    totalPages: 1,
  })

  const [created, setCreated] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [deleted, setDeleted] = useState(null)

  const getProductList = async () => {
    try {
      const res = await productApi.find({ page: filters._page, limit: filters._limit })
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
      _limit: limit,
    }))
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
                    page={pagination.page}
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
