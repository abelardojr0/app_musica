const { config: loadEnv } = require('dotenv')

loadEnv()

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    spotifyScopes: process.env.SPOTIFY_SCOPES
  }
})
