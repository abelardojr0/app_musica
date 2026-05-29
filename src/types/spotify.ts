export type SpotifyTrack = {
  id: string;
  uri: string;
};

export type SpotifyTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};
