import * as SecureStore from 'expo-secure-store'
import * as AuthSession from 'expo-auth-session'
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPES } from '../utils/env'

const TOKEN_KEY = 'spotify_tokens_v1'

type TokenStorage = {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token'
}

export async function authorizeWithSpotify(): Promise<void> {
  if (!SPOTIFY_CLIENT_ID) throw new Error('SPOTIFY_CLIENT_ID nao configurado')
  if (!SPOTIFY_REDIRECT_URI) throw new Error('SPOTIFY_REDIRECT_URI nao configurado')

  const request = new AuthSession.AuthRequest({
    clientId: SPOTIFY_CLIENT_ID,
    scopes: SPOTIFY_SCOPES,
    redirectUri: SPOTIFY_REDIRECT_URI,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code
  })

  const result = await request.promptAsync(discovery)

  if (result.type !== 'success' || !result.params?.code) {
    throw new Error('Falha na autenticacao do Spotify.')
  }

  await exchangeCodeForTokens(result.params.code, request.codeVerifier || '')
}

export async function saveTokens(tokens: TokenStorage) {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens))
}

export async function loadTokens(): Promise<TokenStorage | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY)
  return raw ? (JSON.parse(raw) as TokenStorage) : null
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export async function getValidAccessToken(): Promise<string> {
  const tokens = await loadTokens()
  if (!tokens) throw new Error('Usuario nao autenticado')

  const now = Date.now()
  if (tokens.expiresAt && tokens.expiresAt > now + 60_000) return tokens.accessToken

  if (tokens.refreshToken) {
    const refreshed = await refreshAccessToken(tokens.refreshToken)
    return refreshed.accessToken
  }

  throw new Error('Token expirado e sem refresh token disponivel')
}

async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenStorage> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier
  })

  const res = await fetch(discovery.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })

  if (!res.ok) throw new Error('Falha ao trocar codigo por token')

  const json = await res.json()
  const expiresIn = json.expires_in ? Number(json.expires_in) : 3600
  const tokens: TokenStorage = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: Date.now() + expiresIn * 1000
  }

  await saveTokens(tokens)
  return tokens
}

async function refreshAccessToken(refreshToken: string): Promise<TokenStorage> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: SPOTIFY_CLIENT_ID
  })

  const res = await fetch(discovery.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })

  if (!res.ok) throw new Error('Falha ao renovar token')

  const json = await res.json()
  const expiresIn = json.expires_in ? Number(json.expires_in) : 3600
  const tokens: TokenStorage = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token || refreshToken,
    expiresAt: Date.now() + expiresIn * 1000
  }

  await saveTokens(tokens)
  return tokens
}
