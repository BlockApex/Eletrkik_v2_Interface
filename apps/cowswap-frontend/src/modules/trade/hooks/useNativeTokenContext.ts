import { useMemo } from 'react'

import useNativeCurrency from 'lib/hooks/useNativeCurrency'

import { useIsNativeIn, useIsNativeOut } from './useIsNativeInOrOut'
import { useIsWrappedIn, useIsWrappedOut } from './useIsWrappedInOrOut'

export function useNativeTokenContext() {
  const native = useNativeCurrency()
  const wrappedToken = native.wrapped

  const isNativeIn = useIsNativeIn()
  const isNativeOut = useIsNativeOut()

  const isWrappedIn = useIsWrappedIn()
  const isWrappedOut = useIsWrappedOut()

  return useMemo(() => {
    return {
      isNativeIn,
      isNativeOut,
      isWrappedIn,
      isWrappedOut,
      wrappedToken,
      native,
    }
  }, [isNativeIn, isNativeOut, isWrappedIn, isWrappedOut, wrappedToken, native])
}
