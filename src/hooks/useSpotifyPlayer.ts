import { useCallback, useState } from 'react'
import * as spotifyPlayerService from '../services/spotifyPlayerService'

export function useSpotifyPlayer() {
  const [lastUri, setLastUri] = useState<string | null>(spotifyPlayerService.getLastScannedUri())

  const playTrack = useCallback(async (uri: string) => {
    await spotifyPlayerService.playTrack(uri)
    setLastUri(uri)
  }, [])

  const pause = useCallback(async () => spotifyPlayerService.pause(), [])
  const resume = useCallback(async () => spotifyPlayerService.resume(), [])

  const stop = useCallback(async () => {
    await spotifyPlayerService.pause()
    spotifyPlayerService.clearLastScannedUri()
    setLastUri(null)
  }, [])

  const togglePlayPause = useCallback(async () => {
    try {
      await spotifyPlayerService.togglePlayPause()
    } catch (error) {
      const storedUri = lastUri || spotifyPlayerService.getLastScannedUri()
      if (!storedUri) throw error

      await spotifyPlayerService.playTrack(storedUri)
    }
  }, [lastUri])

  const getPlaybackState = useCallback(() => spotifyPlayerService.getPlaybackState(), [])

  return { playTrack, pause, resume, stop, togglePlayPause, getPlaybackState }
}
