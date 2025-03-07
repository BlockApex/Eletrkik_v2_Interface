import { useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

import { useWeb3React } from '@web3-react/core'

import { getSafeInfo } from '@cowprotocol/core'
import { getCurrentChainIdFromUrl } from '@cowprotocol/common-utils'

import { useSafeAppsSdkInfo } from './hooks/useSafeAppsSdkInfo'
import { useIsSafeWallet, useWalletMetaData } from './hooks/useWalletMetadata'

import { gnosisSafeInfoAtom, walletDetailsAtom, walletInfoAtom } from '../api/state'
import { GnosisSafeInfo, WalletDetails, WalletInfo } from '../api/types'
import { getWalletType } from '../api/utils/getWalletType'
import { getWalletTypeLabel } from '../api/utils/getWalletTypeLabel'
import { useIsSmartContractWallet } from './hooks/useIsSmartContractWallet'
import { SupportedChainId } from '@cowprotocol/cow-sdk'
import { useENSName } from '@cowprotocol/ens'

// Smart contract wallets are filtered out by default, no need to add them to this list
const UNSUPPORTED_WC_WALLETS = new Set(['DeFi Wallet', 'WallETH'])

function _checkIsSupportedWallet(walletName?: string): boolean {
  return !(walletName && UNSUPPORTED_WC_WALLETS.has(walletName))
}

function _useWalletInfo(): WalletInfo {
  const { account, chainId, isActive: active } = useWeb3React()
  const isChainIdUnsupported = !!chainId && !(chainId in SupportedChainId)

  return useMemo(
    () => ({
      chainId: isChainIdUnsupported || !chainId ? getCurrentChainIdFromUrl() : chainId,
      active,
      account,
    }),
    [chainId, active, account, isChainIdUnsupported]
  )
}

function _useWalletDetails(account?: string): WalletDetails {
  const { ENSName: ensName } = useENSName(account ?? undefined)
  const isSmartContractWallet = useIsSmartContractWallet()
  const { walletName, icon } = useWalletMetaData()

  return useMemo(() => {
    return {
      isSmartContractWallet,
      walletName,
      icon,
      ensName: ensName || undefined,
      isSupportedWallet: _checkIsSupportedWallet(walletName),

      // TODO: For now, all SC wallets use pre-sign instead of offchain signing
      // In the future, once the API adds EIP-1271 support, we can allow some SC wallets to use offchain signing
      allowsOffchainSigning: !isSmartContractWallet,
    }
  }, [isSmartContractWallet, walletName, icon, ensName])
}

function _useSafeInfo(walletInfo: WalletInfo): GnosisSafeInfo | undefined {
  const { provider } = useWeb3React()
  const { account, chainId } = walletInfo
  const isSafeConnected = useIsSafeWallet()
  const [safeInfo, setSafeInfo] = useState<GnosisSafeInfo>()
  const { isReadOnly } = useSafeAppsSdkInfo() || {}

  useEffect(() => {
    if (chainId && account && isSafeConnected && provider) {
      getSafeInfo(chainId, account, provider)
        .then((_safeInfo) =>
          setSafeInfo({
            isReadOnly,
            ..._safeInfo,
          })
        )
        .catch((error) => {
          console.error('[WalletUpdater] Error getting Safe Info', error)
        })
    } else {
      setSafeInfo(undefined)
    }
  }, [setSafeInfo, chainId, account, isSafeConnected, provider, isReadOnly])

  return safeInfo
}

export function WalletUpdater() {
  const walletInfo = _useWalletInfo()
  const walletDetails = _useWalletDetails(walletInfo.account)
  const gnosisSafeInfo = _useSafeInfo(walletInfo)

  const setWalletInfo = useSetAtom(walletInfoAtom)
  const setWalletDetails = useSetAtom(walletDetailsAtom)
  const setGnosisSafeInfo = useSetAtom(gnosisSafeInfoAtom)

  // Update wallet info
  useEffect(() => {
    console.log('[WalletUpdater] setWalletInfo', walletInfo)
    setWalletInfo(walletInfo)
  }, [walletInfo, setWalletInfo])

  // Update wallet details
  useEffect(() => {
    console.log('[WalletUpdater] setWalletDetails', walletDetails)
    const walletType = getWalletType({ gnosisSafeInfo, isSmartContractWallet: walletDetails.isSmartContractWallet })
    setWalletDetails({
      walletName: getWalletTypeLabel(walletType), // Fallback wallet name, will be overridden by below line if something exists.
      ...walletDetails,
    })
  }, [walletDetails, setWalletDetails, gnosisSafeInfo])

  // Update Gnosis Safe info
  useEffect(() => {
    console.log('[WalletUpdater] setGnosisSafeInfo', gnosisSafeInfo)
    setGnosisSafeInfo(gnosisSafeInfo)
  }, [gnosisSafeInfo, setGnosisSafeInfo])

  return null
}
