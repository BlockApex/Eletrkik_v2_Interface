// import { Trans } from '@lingui/macro'
import { /*Currency,*/ Percent /*, TradeType*/ } from '@uniswap/sdk-core'
// import Card from 'components/Card'
// import { LoadingRows } from 'components/Loader/styled'
// import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'constants/chains'
// import { useWeb3React } from '@web3-react/core'
// import { useContext, useMemo } from 'react'
// import { InterfaceTrade } from 'state/routing/types'
// import styled, { ThemeContext } from 'styled-components/macro'

// import { Separator, ThemedText } from '../../theme'
// import { computeRealizedLPFeePercent } from '../../utils/prices'
// import { AutoColumn } from '../Column'
// import { RowBetween, RowFixed } from '../Row'
// import FormattedPriceImpact from './FormattedPriceImpact'

// MOD imports
import TradeGp from 'state/swap/TradeGp'
import TradeSummary from '../TradeSummary'

/* const StyledCard = styled(Card)`
  padding: 0;
` */

export interface AdvancedSwapDetailsProps {
  // trade?: InterfaceTrade<Currency, Currency, TradeType>
  trade?: TradeGp
  allowedSlippage: Percent
  // syncing?: boolean
  // hideRouteDiagram?: boolean
  showHelpers?: boolean
  showFee?: boolean
}

/* function TextWithLoadingPlaceholder({
  syncing,
  width,
  children,
}: {
  syncing: boolean
  width: number
  children: JSX.Element
}) {
  return syncing ? (
    <LoadingRows>
      <div style={{ height: '15px', width: `${width}px` }} />
    </LoadingRows>
  ) : (
    children
  )
} */

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  showHelpers = true,
  showFee = true,
}: AdvancedSwapDetailsProps) {
  /* const theme = useContext(ThemeContext)
  const { chainId } = useWeb3React()

  const { expectedOutputAmount, priceImpact } = useMemo(() => {
    if (!trade) return { expectedOutputAmount: undefined, priceImpact: undefined }
    const expectedOutputAmount = trade.outputAmount
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    return { expectedOutputAmount, priceImpact }
  }, [trade]) */

  return !trade ? null : (
    <TradeSummary trade={trade} allowedSlippage={allowedSlippage} showHelpers={showHelpers} showFee={showFee} />
    /* <StyledCard>
      <AutoColumn gap="8px">
        <RowBetween>
          <RowFixed>
            <ThemedText.SubHeader color={theme.text1}>
              <Trans>Expected Output</Trans>
            </ThemedText.SubHeader>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={65}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              {expectedOutputAmount
                ? `${expectedOutputAmount.toSignificant(6)}  ${expectedOutputAmount.currency.symbol}`
                : '-'}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <ThemedText.SubHeader color={theme.text1}>
              <Trans>Price Impact</Trans>
            </ThemedText.SubHeader>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              <FormattedPriceImpact priceImpact={priceImpact} />
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <Separator />
        <RowBetween>
          <RowFixed style={{ marginRight: '20px' }}>
            <ThemedText.SubHeader color={theme.text3}>
              {trade.tradeType === TradeType.EXACT_INPUT ? (
                <Trans>Minimum received</Trans>
              ) : (
                <Trans>Maximum sent</Trans>
              )}{' '}
              <Trans>after slippage</Trans> ({allowedSlippage.toFixed(2)}%)
            </ThemedText.SubHeader>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={70}>
            <ThemedText.Black textAlign="right" fontSize={14} color={theme.text3}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${trade.outputAmount.currency.symbol}`
                : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${trade.inputAmount.currency.symbol}`}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        {!trade?.gasUseEstimateUSD || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
          <RowBetween>
            <ThemedText.SubHeader color={theme.text3}>
              <Trans>Network Fee</Trans>
            </ThemedText.SubHeader>
            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <ThemedText.Black textAlign="right" fontSize={14} color={theme.text3}>
                ~${trade.gasUseEstimateUSD.toFixed(2)}
              </ThemedText.Black>
            </TextWithLoadingPlaceholder>
          </RowBetween>
        )}
      </AutoColumn>
    </StyledCard>*/
  )
}
