import { useMemo } from 'react'

import { TOKEN_SHORTHANDS } from '@cowprotocol/common-const'
import { useBytes32TokenContract, useTokenContract } from '@cowprotocol/common-hooks'
import { isAddress } from '@cowprotocol/common-utils'
import { isChainAllowed, useWalletInfo } from '@cowprotocol/wallet'
import { arrayify } from '@ethersproject/bytes'
import { parseBytes32String } from '@ethersproject/strings'
import { Currency, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'

import { NEVER_RELOAD, useSingleCallResult } from 'lib/hooks/multicall'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

export function parseStringOrBytes32(
  str: string | undefined,
  bytes32: string | undefined,
  defaultValue: string
): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue
}

/**
 * Returns a Token from the tokenAddress.
 * Returns null if token is loading or null was passed.
 * Returns undefined if tokenAddress is invalid or token does not exist.
 */
export function useTokenFromNetwork(tokenAddress: string | null | undefined): Token | null | undefined {
  const { connector } = useWeb3React()
  const { chainId } = useWalletInfo()
  const chainAllowed = chainId && isChainAllowed(connector, chainId)

  const formattedAddress = isAddress(tokenAddress)

  const tokenContract = useTokenContract(formattedAddress ? formattedAddress : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(formattedAddress ? formattedAddress : undefined, false)

  const tokenName = useSingleCallResult(tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(tokenContractBytes32, 'name', undefined, NEVER_RELOAD)
  const symbol = useSingleCallResult(tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (typeof tokenAddress !== 'string' || !chainAllowed || !formattedAddress) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        formattedAddress,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    formattedAddress,
    chainId,
    chainAllowed,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    tokenAddress,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ])
}

export type TokenMap = { [address: string]: Token }

/**
 * Returns a Token from the tokenAddress.
 * Returns null if token is loading or null was passed.
 * Returns undefined if tokenAddress is invalid or token does not exist.
 */
export function useTokenFromMapOrNetwork(tokens: TokenMap, tokenAddress?: string | null): Token | null | undefined {
  const address = isAddress(tokenAddress)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenFromNetwork = useTokenFromNetwork(token ? undefined : address ? address : undefined)

  return tokenFromNetwork ?? token
}

/**
 * Returns a Currency from the currencyId.
 * Returns null if currency is loading or null was passed.
 * Returns undefined if currencyId is invalid or token does not exist.
 */
export function useCurrencyFromMap(tokens: TokenMap, currencyId?: string | null): Currency | null | undefined {
  const nativeCurrency = useNativeCurrency()
  const { connector } = useWeb3React()
  const { chainId } = useWalletInfo()
  const isNative = Boolean(nativeCurrency && ['ETH', 'XDAI'].includes(currencyId?.toUpperCase() || '')) // MOD!!
  const shorthandMatchAddress = useMemo(() => {
    return currencyId ? TOKEN_SHORTHANDS[currencyId.toUpperCase()]?.[chainId] : undefined
  }, [chainId, currencyId])

  const token = useTokenFromMapOrNetwork(tokens, isNative ? undefined : shorthandMatchAddress ?? currencyId)

  const chainAllowed = chainId && isChainAllowed(connector, chainId)
  if (currencyId === null || currencyId === undefined || !chainAllowed) return null

  // this case so we use our builtin wrapped token instead of wrapped tokens on token lists
  const wrappedNative = nativeCurrency?.wrapped
  if (wrappedNative?.address?.toUpperCase() === currencyId?.toUpperCase()) return wrappedNative

  return isNative ? nativeCurrency : token
}
