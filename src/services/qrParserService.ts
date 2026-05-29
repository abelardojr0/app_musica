export type ParsedQr = {
  type: 'spotify-track'
  trackId: string
  uri: string
  originalValue: string
}

export class QrParseError extends Error {}

const SPOTIFY_TRACK_ID_PATTERN = '[A-Za-z0-9]{10,}'
const regexes: RegExp[] = [
  new RegExp(`^spotify:track:(${SPOTIFY_TRACK_ID_PATTERN})(?:\\?.*)?$`, 'i'),
  new RegExp(`^https?:\\/\\/open\\.spotify\\.com\\/(?:intl-[^/]+\\/)?track\\/(${SPOTIFY_TRACK_ID_PATTERN})(?:[/?#].*)?$`, 'i'),
  new RegExp(`^https?:\\/\\/play\\.spotify\\.com\\/track\\/(${SPOTIFY_TRACK_ID_PATTERN})(?:[/?#].*)?$`, 'i')
]

export function parseQrContent(value: string): ParsedQr {
  if (!value || value.trim().length === 0) {
    throwInvalidQr()
  }

  const trimmed = value.trim()

  for (const regex of regexes) {
    const match = regex.exec(trimmed)
    if (match?.[1]) return buildParsedQr(match[1], value)
  }

  const embeddedTrackId = extractSpotifyTrackIdFromUrl(trimmed)
  if (embeddedTrackId) return buildParsedQr(embeddedTrackId, value)

  throwInvalidQr()
}

function extractSpotifyTrackIdFromUrl(value: string) {
  try {
    const url = new URL(value)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const trackIndex = pathParts.findIndex((part) => part.toLowerCase() === 'track')
    const maybeTrackId = trackIndex >= 0 ? pathParts[trackIndex + 1] : null

    if (url.hostname.includes('spotify') && maybeTrackId && /^[A-Za-z0-9]{10,}$/.test(maybeTrackId)) {
      return maybeTrackId
    }

    for (const param of url.searchParams.values()) {
      const parsedParam = tryParseNestedSpotifyValue(param)
      if (parsedParam) return parsedParam
    }
  } catch {
    return null
  }

  return null
}

function tryParseNestedSpotifyValue(value: string) {
  try {
    return parseQrContent(decodeURIComponent(value)).trackId
  } catch {
    return null
  }
}

function buildParsedQr(trackId: string, originalValue: string): ParsedQr {
  return {
    type: 'spotify-track',
    trackId,
    uri: `spotify:track:${trackId}`,
    originalValue
  }
}

function throwInvalidQr(): never {
  throw new QrParseError('Este QR Code nao parece conter uma musica valida do Spotify.')
}
