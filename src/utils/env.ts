import Constants from "expo-constants";
import { makeRedirectUri } from "expo-auth-session";

const extra = (Constants.expoConfig?.extra ?? Constants.manifest?.extra) as
  | Record<string, string>
  | undefined;

export const SPOTIFY_CLIENT_ID =
  process.env.SPOTIFY_CLIENT_ID || extra?.spotifyClientId || "";
export const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI ||
  extra?.spotifyRedirectUri ||
  makeRedirectUri({ scheme: "music-timeline-scanner" });
export const SPOTIFY_SCOPES = (
  process.env.SPOTIFY_SCOPES ||
  extra?.spotifyScopes ||
  "user-modify-playback-state user-read-playback-state user-read-currently-playing"
).split(" ");
