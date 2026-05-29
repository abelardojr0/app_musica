# Music Timeline Scanner

Companion app mobile em React Native, Expo e TypeScript para jogos pessoais de linha do tempo musical. O app le QR Codes com links/URIs do Spotify e envia comandos para o Spotify tocar a musica, sem exibir nome, artista, capa, ano ou qualquer metadado da faixa.

Este projeto nao usa marca, assets, banco de musicas, textos ou design proprietarios de nenhum jogo comercial. Ele tambem nao baixa, armazena, modifica ou reproduz audio do Spotify diretamente.

## Funcionalidades

- Le QR Codes pela camera do celular.
- Aceita `spotify:track:<id>`.
- Aceita `https://open.spotify.com/track/<id>`.
- Aceita `https://open.spotify.com/intl-.../track/<id>`.
- Aceita links com query params, como `?si=...`.
- Tenta extrair links do Spotify dentro de URLs intermediarias quando o link final esta presente em algum parametro.
- Autentica no Spotify com Authorization Code Flow + PKCE.
- Guarda tokens com `expo-secure-store`.
- Envia `PUT /v1/me/player/play` com `spotify:track:<trackId>`.
- Controla Play/Pause pela Spotify Web API.
- Mostra apenas status e controles simples.

## Requisitos

- Node.js e npm.
- Conta Spotify.
- Conta Spotify Premium para controlar playback via Web API.
- Um app criado no Spotify Developer Dashboard.
- Um dispositivo Spotify ativo para receber os comandos.

## Configuracao no Spotify Developer Dashboard

1. Acesse https://developer.spotify.com/dashboard.
2. Crie um app.
3. Copie o Client ID.
4. Configure uma Redirect URI igual ao valor que voce colocara em `SPOTIFY_REDIRECT_URI`.

Exemplos comuns:

```text
exp://SEU_IP_LOCAL:19000
exp://SEU_IP_LOCAL:19003
music-timeline-scanner://redirect
```

Em Expo Go, a Redirect URI pode variar por rede, porta e modo de conexao. Rode o app e confira a URI efetiva se a autenticacao falhar.

## Variaveis de ambiente

Crie um arquivo `.env` na raiz:

```bash
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_REDIRECT_URI=sua_redirect_uri
SPOTIFY_SCOPES=user-modify-playback-state user-read-playback-state user-read-currently-playing
```

Nunca coloque Client Secret no app mobile. Este projeto usa PKCE.

## Instalacao

```bash
npm install
```

## Rodar no Android

```bash
npm start
```

Depois abra no Expo Go, ou rode:

```bash
npm run android
```

Se a porta padrao estiver ocupada:

```bash
npx expo start -c --port 19003
```

Se o celular nao encontrar o Metro pela rede local:

```bash
npx expo start -c --tunnel
```

## Rodar no iOS

```bash
npm start
```

Abra pelo Expo Go no iPhone, ou use um build nativo/dev client quando precisar de configuracao nativa.

## Limitacoes reais do Spotify

- Controle remoto de playback via Spotify Web API exige Spotify Premium.
- O usuario precisa estar autenticado.
- Pode ser necessario abrir o Spotify e dar play em qualquer musica uma vez para criar um dispositivo ativo.
- Se nao houver dispositivo ativo, a API pode retornar 404.
- O app nao reproduz audio internamente. O audio sempre toca pelo Spotify.

## Por que o app nao mostra dados da musica?

A experiencia proposta depende de nao revelar a resposta. Por isso a interface nao mostra capa, nome da musica, artista, album, ano ou metadados.

## Gerar QR Codes de teste

Voce pode gerar QR Codes com qualquer gerador de QR usando valores como:

```text
spotify:track:11dFghVXANMlKmJXsNCbNl
https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl
https://open.spotify.com/intl-pt/track/11dFghVXANMlKmJXsNCbNl?si=abc123
```

## Testes

```bash
npm test -- --runInBand
```

Os testes cobrem o parser de QR Code.

## Estrutura

```text
src/
  components/
  hooks/
  navigation/
  screens/
  services/
  types/
  utils/
```

## Observacao sobre Expo Go

O projeto foi ajustado para usar uma versao atual do pacote Expo. Se o Expo Go ainda mostrar uma tela generica de erro, limpe o cache com `npx expo start -c`, confira se o celular acessa a mesma rede do computador e verifique se a Redirect URI do Spotify bate exatamente com a URI usada pelo app.
