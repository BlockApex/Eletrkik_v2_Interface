import { ArrowLeft, X } from 'react-feather'
import styled from 'styled-components/macro'

import { UI } from 'common/constants/theme'

import { IconButton } from '../commonElements'

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 500;
  font-size: 20px;
  padding: 20px;
  border-bottom: 1px solid var(${UI.COLOR_BORDER});
`

export interface ModalHeaderProps {
  children: string
  onBack(): void
  onClose(): void
  className?: string
}

export function ModalHeader({ children, className, onBack, onClose }: ModalHeaderProps) {
  return (
    <Header className={className}>
      <div>
        <IconButton onClick={onBack}>
          <ArrowLeft />
        </IconButton>
      </div>
      <div>{children}</div>
      <div>
        <IconButton onClick={onClose}>
          <X />
        </IconButton>
      </div>
    </Header>
  )
}
