import { Connector } from '@web3-react/types'
import WALLET_CONNECT_ICON_URL from 'assets/images/walletConnectIcon.svg'
import { ConnectionType, walletConnectConnection } from 'connection'
import { getConnectionName } from 'connection/utils'
import { useIsActiveWallet } from 'hooks/useIsActiveWallet'

import Option from 'components/WalletModal/Option'

const BASE_PROPS = {
  color: '#4196FC',
  icon: WALLET_CONNECT_ICON_URL,
  id: 'wallet-connect',
}

export function WalletConnectOption({ tryActivation }: { tryActivation: (connector: Connector) => void }) {
  // const isActive = walletConnectConnection.hooks.useIsActive()
  const isActive = useIsActiveWallet(walletConnectConnection)
  return (
    <Option
      {...BASE_PROPS}
      isActive={isActive}
      onClick={() => tryActivation(walletConnectConnection.connector)}
      header={getConnectionName(ConnectionType.WALLET_CONNECT)}
    />
  )
}