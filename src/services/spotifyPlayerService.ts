import { getValidAccessToken } from './spotifyAuthService'

const API_BASE = 'https://api.spotify.com/v1'

let lastScannedUri: string | null = null

export async function playTrack(uri: string, deviceId?: string) {
  const token = await getValidAccessToken()
  const url = deviceId
    ? `${API_BASE}/me/player/play?device_id=${encodeURIComponent(deviceId)}`
    : `${API_BASE}/me/player/play`

  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [uri] })
  })

  if (!res.ok) await handleSpotifyError(res.status)

  lastScannedUri = uri
}

export async function pause() {
  const token = await getValidAccessToken()
  const res = await fetch(`${API_BASE}/me/player/pause`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) await handleSpotifyError(res.status)
}

export async function resume() {
  const token = await getValidAccessToken()
  const res = await fetch(`${API_BASE}/me/player/play`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) await handleSpotifyError(res.status)
}

export async function getPlaybackState(): Promise<any> {
  const token = await getValidAccessToken()
  const res = await fetch(`${API_BASE}/me/player`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (res.status === 204) return null
  if (!res.ok) await handleSpotifyError(res.status)

  return res.json()
}

export async function getActiveDevice(): Promise<any> {
  const state = await getPlaybackState()
  return state?.device ?? null
}

export async function togglePlayPause() {
  const state = await getPlaybackState()

  if (state?.is_playing) {
    await pause()
    return
  }

  if (state) {
    await resume()
    return
  }

  if (lastScannedUri) {
    await playTrack(lastScannedUri)
    return
  }

  await resume()
}

export function getLastScannedUri() {
  return lastScannedUri
}

export function clearLastScannedUri() {
  lastScannedUri = null
}

async function handleSpotifyError(status: number) {
  if (status === 401) throw new Error('Token expirado ou invalido.')
  if (status === 403) throw new Error('Para controlar musicas diretamente pelo app, e necessario usar uma conta Spotify Premium.')
  if (status === 404) throw new Error('Nenhum dispositivo Spotify ativo encontrado. Abra o Spotify, de play em qualquer musica uma vez e volte para o app.')
  if (status === 429) throw new Error('Rate limit atingido. Tente novamente mais tarde.')
  throw new Error('Erro ao comunicar com Spotify API.')
}

export default {
  playTrack,
  pause,
  resume,
  getPlaybackState,
  getActiveDevice,
  togglePlayPause,
  getLastScannedUri,
  clearLastScannedUri
}
