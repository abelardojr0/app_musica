import { useState, useEffect } from "react";
import {
  authorizeWithSpotify,
  clearTokens,
  loadTokens,
} from "../services/spotifyAuthService";

export function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const tokens = await loadTokens();
      setIsAuthenticated(!!tokens);
    })();
  }, []);

  async function connect() {
    try {
      await authorizeWithSpotify();
      setIsAuthenticated(true);
    } catch (error) {
      console.warn("Erro ao conectar Spotify:", error);
      setIsAuthenticated(false);
      throw error;
    }
  }

  async function signOut() {
    await clearTokens();
    setIsAuthenticated(false);
  }

  return { isAuthenticated, connect, signOut };
}
