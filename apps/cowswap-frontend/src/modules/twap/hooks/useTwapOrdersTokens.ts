import { useAtomValue } from 'jotai/index'
import { useMemo } from 'react'

import { useAsyncMemo } from 'use-async-memo'

import { useTokensForOrdersList, getTokensListFromOrders } from 'modules/orders'
import { TokensByAddress } from 'modules/tokensList/state/tokensListAtom'

import { twapOrdersListAtom } from '../state/twapOrdersListAtom'
import { twapPartOrdersListAtom } from '../state/twapPartOrdersAtom'

export function useTwapOrdersTokens(): TokensByAddress | undefined {
  const allTwapOrders = useAtomValue(twapOrdersListAtom)
  const twapPartOrders = useAtomValue(twapPartOrdersListAtom)

  const getTokensForOrdersList = useTokensForOrdersList()

  const tokensToFetch = useMemo(() => {
    return getTokensListFromOrders([...allTwapOrders, ...twapPartOrders])
  }, [allTwapOrders, twapPartOrders])

  return useAsyncMemo(() => getTokensForOrdersList(tokensToFetch), [getTokensForOrdersList, tokensToFetch])
}
