import { SupportedChainId } from '@cowprotocol/cow-sdk'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'

import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'

import { TRADE_URL_SELL_AMOUNT_KEY } from 'modules/trade/const/tradeUrl'
import { TradeUrlParams } from 'modules/trade/types/TradeRawState'
import { parameterizeTradeRoute } from 'modules/trade/utils/parameterizeTradeRoute'

import { Routes } from 'common/constants/routes'
import { InlineBanner } from 'common/pure/InlineBanner'

const StyledNavLink = styled(NavLink)`
  color: inherit;
  display: inline;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export interface TwapSuggestionBannerProps {
  chainId: SupportedChainId
  priceImpact: Percent | undefined
  buyingFiatAmount: CurrencyAmount<Currency> | null
  tradeUrlParams: TradeUrlParams
  sellAmount: string | undefined
}

const PRICE_IMPACT_LIMIT = 1 // 1%
const AMOUNT_LIMIT: Record<SupportedChainId, number> = {
  [SupportedChainId.MAINNET]: 50_000, // $50,000
  [SupportedChainId.GNOSIS_CHAIN]: 500, // $500
  [SupportedChainId.GOERLI]: 100, // $100
}

export function TwapSuggestionBanner({
  priceImpact,
  buyingFiatAmount,
  tradeUrlParams,
  chainId,
  sellAmount,
}: TwapSuggestionBannerProps) {
  if (!priceImpact || priceImpact.lessThan(0)) return null

  const shouldSuggestTwap =
    +priceImpact.toFixed(2) > PRICE_IMPACT_LIMIT && +(buyingFiatAmount?.toExact() || 0) > AMOUNT_LIMIT[chainId]

  if (!shouldSuggestTwap) return null

  const routePath =
    parameterizeTradeRoute(tradeUrlParams, Routes.ADVANCED_ORDERS) + `?${TRADE_URL_SELL_AMOUNT_KEY}=${sellAmount}`

  return (
    <InlineBanner bannerType="alert">
      <strong>Minimize price impact with TWAP</strong>
      <p>
        The price impact is <b>{+priceImpact.toFixed(2)}%</b>. Consider breaking up your order using a{' '}
        <StyledNavLink to={routePath}>TWAP order</StyledNavLink> and possibly get a better rate.
      </p>
    </InlineBanner>
  )
}
