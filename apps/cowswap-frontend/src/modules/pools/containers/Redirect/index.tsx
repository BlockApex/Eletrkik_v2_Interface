import { useWeb3React } from '@web3-react/core'
import { WRAPPED_NATIVE_CURRENCY } from 'modules/pools/constants/tokens';
import AddLiquidityWrapper from 'pages/Pool/AddLiquidity';
import { Navigate, useParams } from 'react-router-dom'


export function RedirectDuplicateTokenIds() {
  const { currencyIdA, currencyIdB } = useParams<{ currencyIdA: string; currencyIdB: string; feeAmount?: string }>()

  const { chainId } = useWeb3React()

  // prevent weth + eth
  const isETHOrWETHA =
    currencyIdA === 'ETH' || (chainId !== undefined && currencyIdA === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
  const isETHOrWETHB =
    currencyIdB === 'ETH' || (chainId !== undefined && currencyIdB === WRAPPED_NATIVE_CURRENCY[chainId]?.address)

  if (
    currencyIdA &&
    currencyIdB &&
    (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))
  ) {
    return <Navigate to={`/add/${currencyIdA}`} replace />
  }
  return <AddLiquidityWrapper />
}