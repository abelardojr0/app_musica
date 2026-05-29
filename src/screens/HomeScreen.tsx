import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import { useSpotifyAuth } from '../hooks/useSpotifyAuth'

export default function HomeScreen() {
  const navigation = useNavigation()
  const { isAuthenticated, connect } = useSpotifyAuth()
  const [status, setStatus] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setStatus('Conectando ao Spotify...')
      await connect()
      setStatus('Spotify conectado')
    } catch (error: any) {
      setStatus(error.message || 'Erro ao conectar Spotify')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Timeline Scanner</Text>
      <Text style={styles.subtitle}>Escaneie uma carta e controle a musica sem revelar a resposta.</Text>

      <Button onPress={handleConnect} title="Conectar Spotify" />
      <StatusBadge status={isAuthenticated ? 'Spotify conectado' : 'Spotify nao conectado'} />
      {status ? <StatusBadge status={status} type={status.includes('Erro') ? 'error' : 'normal'} /> : null}

      <Button onPress={() => navigation.navigate('Scanner' as never)} title="Comecar" style={{ marginTop: 20 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 }
})
