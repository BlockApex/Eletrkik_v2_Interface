import styled from 'styled-components/macro'

import { SetRecipient } from 'modules/swap/containers/SetRecipient'

import { UI } from 'common/constants/theme'

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.appBody.maxWidth.swap};
  margin: 0 auto;
`

export const ContainerBox = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
  background: var(${UI.COLOR_CONTAINER_BG_01});
  border: none;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.boxShadow1};
  padding: 10px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
`

export const CurrencySeparatorBox = styled.div<{ withRecipient: boolean; compactView: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${({ compactView }) => (compactView ? '-5px 0' : '0')};
  padding: ${({ withRecipient }) => (withRecipient ? '0 10px' : '0')};
`

export const StyledRemoveRecipient = styled(SetRecipient)`
  margin: 15px 0;
`
