import { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'

import TokenListLogo from '@cowprotocol/assets/svg/tokenlist.svg'
import { useTheme } from '@cowprotocol/common-hooks'
import { TokenAmount, TokenSymbol, Loader, RowBetween, RowFixed } from '@cowprotocol/ui'
import { MouseoverTooltip } from '@cowprotocol/ui'
import { useWalletInfo } from '@cowprotocol/wallet'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'

import { Trans } from '@lingui/macro'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components/macro'

import { LightGreyCard } from 'legacy/components/Card'
import Column from 'legacy/components/Column'
import QuestionHelper from 'legacy/components/QuestionHelper'
import ImportRow from 'legacy/components/SearchModal/ImportRow'
import { LoadingRows } from 'legacy/components/SearchModal/styleds'
import { useAllTokens, useIsUserAddedToken } from 'legacy/hooks/Tokens'
import { useIsUnsupportedTokenGp } from 'legacy/state/lists/hooks'
import { WrappedTokenInfo } from 'legacy/state/lists/wrappedTokenInfo'
import { ThemedText } from 'legacy/theme'

import useCurrencyBalance from 'modules/tokens/hooks/useCurrencyBalance'

import { CurrencyLogo } from 'common/pure/CurrencyLogo'

import { Tag } from './styled' // mod

import { MenuItem } from './index'

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER'
}

export const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

export const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <StyledBalanceText>
      <TokenAmount amount={balance} />
    </StyledBalanceText>
  )
}

export const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-flow: row wrap;
`

export const TokenListLogoWrapper = styled.img`
  height: 20px;
`

export const StyledScrollarea = styled.div`
  div:first-of-type {
    overflow-y: auto; // fallback for 'overlay'
    overflow-y: overlay;
    ${({ theme }) => theme.colorScrollbar};
  }
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>
          {tag.icon && <img src={tag.icon} alt={tag.name} />}
          {tag.name}
        </Tag>
      </MouseoverTooltip>

      {/* If there are more than one tag, show the first one and a '...' tag */}
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  showCurrencyAmount,
  isUnsupported, // gp-swap added
  isPermitCompatible, // gp-swap added
  allTokens,
  TokenTagsComponent = TokenTags, // gp-swap added
  BalanceComponent = Balance, // gp-swap added
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  showCurrencyAmount?: boolean
  isUnsupported: boolean // gp-added
  isPermitCompatible: boolean // gp-added
  allTokens: { [address: string]: Token } // gp-added
  BalanceComponent?: (params: { balance: CurrencyAmount<Currency> }) => JSX.Element // gp-swap added
  TokenTagsComponent?: (params: {
    currency: Currency
    isUnsupported: boolean
    isPermitCompatible: boolean
  }) => JSX.Element // gp-swap added
}) {
  const { account } = useWalletInfo()
  const key = currencyKey(currency)
  const isOnSelectedList = currency?.isToken && !!allTokens[currency.address.toLowerCase()]
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  // only show add or remove buttons if not on selected list
  return (
    <>
      <MenuItem
        tabIndex={0}
        style={style}
        className={`token-item token-item-${key}`}
        onKeyPress={(e) => (!isSelected && e.key === 'Enter' ? onSelect() : null)}
        onClick={() => (isSelected ? null : onSelect())}
        disabled={isSelected}
        selected={otherSelected}
      >
        <CurrencyLogo currency={currency} size={'24px'} />
        <Column>
          <Text title={currency.name} fontWeight={500}>
            <TokenSymbol token={currency} /> {/* MOD */}
          </Text>
          <ThemedText.DarkGray ml="0px" fontSize={'12px'} fontWeight={300}>
            {!currency.isNative && !isOnSelectedList && customAdded ? (
              <Trans>{currency.name} • Added by user</Trans>
            ) : (
              currency.name
            )}
          </ThemedText.DarkGray>
        </Column>
        {/* <TokenTags currency={currency} /> */}
        <TokenTagsComponent currency={currency} isUnsupported={isUnsupported} isPermitCompatible={isPermitCompatible} />
        {showCurrencyAmount && (
          <RowFixed style={{ justifySelf: 'flex-end' }}>
            {balance ? <BalanceComponent balance={balance} /> : account ? <Loader /> : null}
          </RowFixed>
        )}
      </MenuItem>
    </>
  )
}

const BREAK_LINE_INACTIVE_LISTS = 'BREAK_INACTIVE_LISTS'
const BREAK_LINE_ADDITIONAL_RESULTS = 'BREAK_ADDITIONAL_RESULTS'
type BreakLine = typeof BREAK_LINE_INACTIVE_LISTS | typeof BREAK_LINE_ADDITIONAL_RESULTS
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE_INACTIVE_LISTS || x === BREAK_LINE_ADDITIONAL_RESULTS
}

function BreakLineBaseComponent({
  style,
  title,
  description,
}: {
  style: CSSProperties
  title: string
  description: string
}) {
  const theme = useTheme()
  return (
    <FixedContentRow style={style}>
      <LightGreyCard padding="8px 12px" $borderRadius="8px">
        <RowBetween>
          <RowFixed>
            <TokenListLogoWrapper src={TokenListLogo} />
            <ThemedText.Main ml="6px" fontSize="12px" color={theme.text1}>
              <Trans>{title}</Trans>
            </ThemedText.Main>
          </RowFixed>
          <QuestionHelper text={<Trans>{description}</Trans>} />
        </RowBetween>
      </LightGreyCard>
    </FixedContentRow>
  )
}

const InactiveListsBreakLineComponent = styled(BreakLineBaseComponent).attrs({
  title: 'Expanded results from inactive Token Lists',
  description: 'Tokens from inactive lists. Import specific tokens below or click Manage to activate more lists.',
})``

const AdditionalResultsBreakLineComponent = styled(BreakLineBaseComponent).attrs({
  title: 'Additional Results from External Sources',
  description: 'Tokens from external sources.',
})``

interface TokenRowProps {
  data: Array<Currency | BreakLine>
  index: number
  style: CSSProperties
}

// TODO: refactor the component
export default function CurrencyList({
  height,
  currencies,
  otherListTokens,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showImportView,
  setImportToken,
  showCurrencyAmount,
  isLoading,
  additionalTokens,
  BalanceComponent = Balance, // gp-swap added
  TokenTagsComponent = TokenTags, // gp-swap added
}: {
  height: number
  currencies: Currency[]
  otherListTokens?: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showImportView: () => void
  setImportToken: (token: Token) => void
  showCurrencyAmount?: boolean
  isLoading: boolean
  searchQuery?: string
  isAddressSearch?: string | false
  additionalTokens?: Currency[]
  BalanceComponent?: (params: { balance: CurrencyAmount<Currency> }) => JSX.Element // gp-swap added
  TokenTagsComponent?: (params: { currency: Currency; isUnsupported: boolean }) => JSX.Element // gp-swap added
}) {
  const allTokens = useAllTokens()
  const isUnsupportedToken = useIsUnsupportedTokenGp()

  const itemData: (Currency | BreakLine)[] = useMemo(() => {
    const result: (Currency | BreakLine)[] = [...currencies]

    if (otherListTokens && otherListTokens?.length > 0) {
      // otherListTokens - it's a list of tokens from inactive lists
      // here we remove tokens that already exist in the active lists
      const filteredOtherListTokens = otherListTokens.filter((token) =>
        token.isToken ? !allTokens[token.address.toLowerCase()] : true
      )

      result.push(BREAK_LINE_INACTIVE_LISTS)
      result.push(...filteredOtherListTokens)
    }

    if (additionalTokens && additionalTokens.length > 0) {
      result.push(BREAK_LINE_ADDITIONAL_RESULTS)
      result.push(...additionalTokens)
    }

    return result
  }, [currencies, otherListTokens, allTokens, additionalTokens])

  const Row = useCallback(
    function TokenRow({ data, index, style }: TokenRowProps) {
      const row: Currency | BreakLine = data[index]

      if (isBreakLine(row)) {
        if (row === BREAK_LINE_ADDITIONAL_RESULTS) {
          return <AdditionalResultsBreakLineComponent style={style} />
        }

        if (row === BREAK_LINE_INACTIVE_LISTS) {
          return <InactiveListsBreakLineComponent style={style} />
        }
      }

      const currency = row

      const isSelected = Boolean(currency && selectedCurrency && selectedCurrency.equals(currency))
      const otherSelected = Boolean(currency && otherCurrency && otherCurrency.equals(currency))
      const handleSelect = () => currency && onCurrencySelect(currency)

      const token = currency?.wrapped

      const showImport = index > currencies.length

      const isUnsupported = !!isUnsupportedToken(token?.address)
      const isPermitCompatible = false // TODO: Make dynamic

      if (isLoading) {
        return (
          <LoadingRows>
            <div />
            <div />
            <div />
          </LoadingRows>
        )
      } else if (showImport && token) {
        return (
          <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
        )
      } else if (currency && token) {
        return (
          <CurrencyRow
            style={style}
            allTokens={allTokens}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            BalanceComponent={BalanceComponent} // gp-swap added
            TokenTagsComponent={TokenTagsComponent} // gp-swap added
            isUnsupported={isUnsupported}
            isPermitCompatible={isPermitCompatible} // gp-swap added
            showCurrencyAmount={showCurrencyAmount}
          />
        )
      } else {
        return null
      }
    },
    [
      currencies.length,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      showCurrencyAmount,
      isLoading,
      isUnsupportedToken,
      BalanceComponent,
      TokenTagsComponent,
      allTokens,
    ]
  )

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index]
    if (isBreakLine(currency)) return currency
    return currencyKey(currency)
  }, [])

  return (
    <StyledScrollarea>
      <FixedSizeList
        height={height}
        ref={fixedListRef as any}
        width="100%"
        itemData={itemData}
        itemCount={itemData.length}
        itemSize={56}
        itemKey={itemKey}
      >
        {Row}
      </FixedSizeList>
    </StyledScrollarea>
  )
}
