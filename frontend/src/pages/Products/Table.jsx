import {
  ActionList,
  Button,
  Checkbox,
  DataTable,
  Popover,
  Stack,
  Thumbnail,
} from '@shopify/polaris'
import { MobileVerticalDotsMajor } from '@shopify/polaris-icons'
import { useState } from 'react'
import Avatar from '../../components/Avatar/index.jsx'
import formatDateTime from '../../helpers/formatDateTime.js'

function Table(props) {
  const { productList, onEdit, onDelete } = props
  const [selected, setSelected] = useState(null)

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

  return (
    <DataTable
      columnContentTypes={['text', 'text', 'text', , 'text']}
      headings={['No.', 'Products', 'Advanced', 'Action']}
      rows={rows}
    />
  )
}

export default Table
