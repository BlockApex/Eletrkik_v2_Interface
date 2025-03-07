import { useLayoutEffect, useState } from 'react'

import Vibrant from 'node-vibrant/lib/bundle'
import { shade } from 'polished'
import { hex } from 'wcag-contrast'
import { uriToHttp } from '@cowprotocol/common-utils'

export async function getColorFromUriPath(uri: string): Promise<string | null> {
  const formattedPath = uriToHttp(uri)[0]

  let palette

  try {
    palette = await Vibrant.from(formattedPath).getPalette()
  } catch (err: any) {
    return null
  }
  if (!palette?.Vibrant) {
    return null
  }

  let detectedHex = palette.Vibrant.hex
  let AAscore = hex(detectedHex, '#FFF')
  while (AAscore < 3) {
    detectedHex = shade(0.005, detectedHex)
    AAscore = hex(detectedHex, '#FFF')
  }

  return detectedHex
}

export function useListColor(listImageUri?: string) {
  const [color, setColor] = useState('#2172E5')

  useLayoutEffect(() => {
    let stale = false

    if (listImageUri) {
      getColorFromUriPath(listImageUri)
        .then((color) => {
          if (!stale && color !== null) {
            setColor(color)
          }
        })
        .catch(console.warn) // mod: error handling
    }

    return () => {
      stale = true
      setColor('#2172E5')
    }
  }, [listImageUri])

  return color
}
