import { SupportedChainId as ChainId } from '@cowprotocol/cow-sdk'
import { TokenAmount } from '@cowprotocol/ui'

import { transparentize } from 'polished'
import styled, { css } from 'styled-components/macro'

import CowProtocolLogo from 'legacy/components/CowProtocolLogo'

import { UI } from 'common/constants/theme'

import { useCombinedBalance } from '../../hooks/useCombinedBalance'

export const Wrapper = styled.div<{ isLoading: boolean }>`
  background-color: transparent;
  color: var(${UI.COLOR_TEXT1});
  padding: 6px 12px;
  border: 2px solid transparent;
  font-weight: 500;
  width: auto;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 21px;
  pointer-events: auto;
  transition: width 0.2s ease-in-out, border 0.2s ease-in-out;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 100%;
    width: auto;
    padding: 6px 12px 6px 8px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 6px 8px;
  `};

  &:hover {
    border: 2px solid ${({ theme }) => transparentize(0.7, theme.text1)};
  }

  ${({ theme, isLoading }) =>
    isLoading &&
    css`
      overflow: hidden;
      &::before {
        z-index: -1;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        ${theme.shimmer}; // shimmer effect
        content: '';
      }
    `}

  > b {
    margin: 0 0 0 5px;
    font-weight: inherit;
    white-space: nowrap;

    ${({ theme }) => theme.mediaWidth.upToMedium`
      overflow: hidden;
      max-width: 100px;
      text-overflow: ellipsis;
    `};

    ${({ theme }) => theme.mediaWidth.upToSmall`
      overflow: visible;
      max-width: initial;
    `};
  }
`

interface CowBalanceButtonProps {
  account?: string | null | undefined
  chainId: ChainId | undefined
  onClick?: () => void
  isUpToSmall?: boolean
}

export default function CowBalanceButton({ onClick, isUpToSmall }: CowBalanceButtonProps) {
  const { balance, isLoading } = useCombinedBalance()

  return (
    <Wrapper isLoading={isLoading} onClick={onClick}>
      <CowProtocolLogo />
      {!isUpToSmall && (
        <b>
          <TokenAmount
            round={true}
            hideTokenSymbol={true}
            amount={balance}
            defaultValue="0"
            tokenSymbol={{ symbol: '(v)COW' }}
          />
        </b>
      )}
    </Wrapper>
  )
}
