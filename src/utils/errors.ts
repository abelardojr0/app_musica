export function mapSpotifyError(status: number): string {
  if (status === 401) return 'Token expirado ou invalido.'
  if (status === 403) return 'Para controlar musicas diretamente pelo app, e necessario usar uma conta Spotify Premium.'
  if (status === 404) return 'Nenhum dispositivo Spotify ativo encontrado. Abra o Spotify, de play em qualquer musica uma vez e volte para o app.'
  if (status === 429) return 'Rate limit atingido. Tente novamente mais tarde.'
  return 'Erro ao comunicar com Spotify API.'
}
