import { useMemo } from 'react'

import { Order, PENDING_STATES } from 'legacy/state/orders/actions'

import { groupOrdersTable } from '../../../utils/groupOrdersTable'
import { getParsedOrderFromItem, isParsedOrder, OrderTableItem } from '../../../utils/orderTableGroupUtils'

export interface OrdersTableList {
  pending: OrderTableItem[]
  history: OrderTableItem[]
}

const ordersSorter = (a: OrderTableItem, b: OrderTableItem) => {
  const aCreationTime = getParsedOrderFromItem(a).creationTime
  const bCreationTime = getParsedOrderFromItem(b).creationTime

  return bCreationTime.getTime() - aCreationTime.getTime()
}

const ORDERS_LIMIT = 100

export function useOrdersTableList(allOrders: Order[]): OrdersTableList {
  const allSortedOrders = useMemo(() => {
    return groupOrdersTable(allOrders).sort(ordersSorter)
  }, [allOrders])

  return useMemo(() => {
    const { pending, history } = allSortedOrders.reduce(
      (acc, item) => {
        const order = isParsedOrder(item) ? item : item.parent

        if (PENDING_STATES.includes(order.status)) {
          acc.pending.push(item)
        } else {
          acc.history.push(item)
        }

        return acc
      },
      { pending: [], history: [] } as OrdersTableList
    )

    return { pending: pending.slice(0, ORDERS_LIMIT), history: history.slice(0, ORDERS_LIMIT) }
  }, [allSortedOrders])
}
