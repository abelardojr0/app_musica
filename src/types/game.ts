export type Player = {
  id: string
  name?: string
}

export type CardScan = {
  id: string
  scannedAt: string
  trackUri?: string
}

export type TimelineCard = {
  id: string
  scanId?: string
  position: number
  placedAt?: string
}

export type GameSession = {
  id: string
  players: Player[]
  scans: CardScan[]
  timeline: TimelineCard[]
}
