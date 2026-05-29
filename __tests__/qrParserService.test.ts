import { describe, expect, test } from '@jest/globals'
import { parseQrContent, QrParseError } from '../src/services/qrParserService'

describe('qrParserService', () => {
  test('parses spotify:track URI', () => {
    const result = parseQrContent('spotify:track:123abcDEF45')
    expect(result.trackId).toBe('123abcDEF45')
    expect(result.uri).toBe('spotify:track:123abcDEF45')
  })

  test('parses open.spotify.com track url', () => {
    const result = parseQrContent('https://open.spotify.com/track/1A2b3C4d5E6')
    expect(result.trackId).toBe('1A2b3C4d5E6')
  })

  test('parses intl-pt url', () => {
    const result = parseQrContent('https://open.spotify.com/intl-pt/track/XYZ987abc12')
    expect(result.trackId).toBe('XYZ987abc12')
  })

  test('parses url with query params', () => {
    const result = parseQrContent('https://open.spotify.com/track/ABC123def45?si=foobar')
    expect(result.trackId).toBe('ABC123def45')
  })

  test('parses nested spotify url in query param when available', () => {
    const result = parseQrContent('https://example.com/go?target=https%3A%2F%2Fopen.spotify.com%2Ftrack%2FNESTED12345')
    expect(result.trackId).toBe('NESTED12345')
  })

  test('throws on invalid url', () => {
    expect(() => parseQrContent('https://example.com/')).toThrow(QrParseError)
  })

  test('throws on empty', () => {
    expect(() => parseQrContent('')).toThrow(QrParseError)
  })

  test('throws on QR without Spotify content', () => {
    expect(() => parseQrContent('just a regular qr code')).toThrow(QrParseError)
  })
})
