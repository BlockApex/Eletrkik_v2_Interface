import TokenListLogo from '@cowprotocol/assets/svg/tokenlist.svg'

import styled from 'styled-components/macro'

import { InfoIcon } from 'legacy/components/InfoIcon'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 20px;
`

const Title = styled.h4`
  font-size: 13px;
  font-weight: 500;

  > img {
    width: 18px;
    vertical-align: middle;
    margin-right: 6px;
  }
`

export interface TokenSourceTitleProps {
  children: string
  tooltip: string
}

export function TokenSourceTitle(props: TokenSourceTitleProps) {
  const { children, tooltip } = props

  return (
    <Wrapper>
      <Title>
        <img src={TokenListLogo} />
        {children}
      </Title>
      <div>
        <InfoIcon iconType="help" content={tooltip} />
      </div>
    </Wrapper>
  )
}
