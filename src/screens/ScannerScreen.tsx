import React, { useEffect, useState } from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera'
import { useNavigation } from '@react-navigation/native'
import Button from '../components/Button'
import ScannerFrame from '../components/ScannerFrame'
import StatusBadge from '../components/StatusBadge'
import { useSpotifyAuth } from '../hooks/useSpotifyAuth'
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer'
import { parseQrContent } from '../services/qrParserService'

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(false)
  const [status, setStatus] = useState('Aguardando QR Code')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showOpenSpotify, setShowOpenSpotify] = useState(false)
  const navigation = useNavigation()
  const { isAuthenticated } = useSpotifyAuth()
  const { playTrack, getPlaybackState } = useSpotifyPlayer()

  useEffect(() => {
    ;(async () => {
      if (!permission) await requestPermission()
    })()
  }, [permission, requestPermission])

  useEffect(() => {
    ;(async () => {
      if (!isAuthenticated) {
        setStatus('Spotify nao conectado')
        return
      }

      try {
        const state = await getPlaybackState()
        setShowOpenSpotify(!state?.device)
        setStatus(state?.device ? 'Aguardando QR Code' : 'Nenhum dispositivo Spotify ativo')
      } catch {
        setStatus('Aguardando QR Code')
      }
    })()
  }, [getPlaybackState, isAuthenticated])

  const openSpotify = async () => {
    try {
      const supported = await Linking.canOpenURL('spotify:')
      await Linking.openURL(supported ? 'spotify:' : 'https://open.spotify.com')
    } catch {
      await Linking.openURL('https://open.spotify.com')
    }
  }

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanning) return

    setScanning(true)
    setErrorMessage(null)
    setShowOpenSpotify(false)
    setStatus('Lendo QR Code...')

    try {
      const parsed = parseQrContent(data)

      if (!isAuthenticated) {
        setErrorMessage('E necessario conectar o Spotify antes de escanear.')
        setStatus('Spotify nao conectado')
        return
      }

      await playTrack(parsed.uri)
      setStatus('Musica enviada para o Spotify')
      navigation.navigate('Player' as never)
    } catch (error: any) {
      const message = error.message || 'Este QR Code nao e valido'
      setErrorMessage(message)
      setStatus(message.includes('Nenhum dispositivo Spotify ativo') ? 'Nenhum dispositivo Spotify ativo' : 'Erro ao ler QR Code')
      setShowOpenSpotify(message.includes('Nenhum dispositivo Spotify ativo'))
    } finally {
      setTimeout(() => setScanning(false), 1200)
    }
  }

  if (!permission) return <Text>Requisitando permissao da camera...</Text>
  if (!permission.granted) return <Text>Permissao de camera negada. Habilite nas configuracoes.</Text>

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Aponte para o QR Code da carta.</Text>
      <View style={styles.scannerContainer}>
        <CameraView
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanning ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />
        <ScannerFrame />
      </View>
      <StatusBadge status={status} />
      {errorMessage ? <StatusBadge status={errorMessage} type="error" /> : null}
      {showOpenSpotify ? <Button title="Abrir Spotify" onPress={openSpotify} style={{ marginTop: 12 }} /> : null}
      <Button title="Voltar" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  instruction: { marginTop: 8, fontSize: 16 },
  scannerContainer: { width: '100%', height: 360, marginTop: 12, borderRadius: 8, overflow: 'hidden' }
})
