import React, { useEffect, useState } from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import { useSpotifyAuth } from '../hooks/useSpotifyAuth'
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer'

export default function PlayerControlScreen() {
  const navigation = useNavigation()
  const { togglePlayPause, stop, getPlaybackState } = useSpotifyPlayer()
  const { connect } = useSpotifyAuth()
  const [status, setStatus] = useState('Musica tocando')
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null)
  const [showOpenSpotify, setShowOpenSpotify] = useState(false)

  useEffect(() => {
    loadPlaybackState()
  }, [])

  const loadPlaybackState = async () => {
    try {
      setError(null)
      const state = await getPlaybackState()
      const playing = state?.is_playing ?? false
      const hasDevice = !!state?.device

      setIsPlaying(playing)
      setShowOpenSpotify(!hasDevice)
      setStatus(hasDevice ? (playing ? 'Tocando' : 'Pausado') : 'Nenhum dispositivo Spotify ativo')
    } catch (error: any) {
      setError(error.message || 'Erro ao consultar estado do Spotify')
      setStatus('Erro ao atualizar status')
    }
  }

  const handleToggle = async () => {
    try {
      setError(null)
      setStatus('Enviando comando')
      await togglePlayPause()
      await loadPlaybackState()
    } catch (error: any) {
      const message = error.message || 'Erro ao alternar playback'
      setError(message)
      setStatus(message.includes('Premium') ? 'Spotify Premium necessario' : 'Erro ao alternar playback')
      setShowOpenSpotify(message.includes('Nenhum dispositivo Spotify ativo'))
    }
  }

  const handleReconnect = async () => {
    try {
      setError(null)
      setStatus('Reconectando Spotify')
      await connect()
      await loadPlaybackState()
    } catch (error: any) {
      setError(error.message || 'Erro ao reconectar Spotify')
      setStatus('Erro ao reconectar Spotify')
    }
  }

  const handleStop = async () => {
    try {
      await stop()
      setStatus('Pausado')
      setIsPlaying(false)
    } catch (error: any) {
      setError(error.message || 'Erro ao parar musica')
    }
  }

  const openSpotify = async () => {
    try {
      const supported = await Linking.canOpenURL('spotify:')
      await Linking.openURL(supported ? 'spotify:' : 'https://open.spotify.com')
    } catch {
      await Linking.openURL('https://open.spotify.com')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle</Text>
      <StatusBadge status={status} />
      {error ? <StatusBadge status={error} type="error" /> : null}
      <Text style={styles.subTitle}>{isPlaying === null ? 'Status desconhecido' : isPlaying ? 'Reproducao ativa' : 'Reproducao pausada'}</Text>

      <Button title="Play/Pause" onPress={handleToggle} />
      <Button title="Escanear proxima" onPress={() => navigation.navigate('Scanner' as never)} style={{ marginTop: 12 }} />
      {showOpenSpotify ? <Button title="Abrir Spotify" onPress={openSpotify} style={{ marginTop: 12 }} /> : null}
      <Button title="Parar musica" onPress={handleStop} style={{ marginTop: 12 }} />
      <Button title="Reconectar Spotify" onPress={handleReconnect} style={{ marginTop: 12 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginVertical: 8 },
  subTitle: { marginTop: 8, color: '#555' }
})
