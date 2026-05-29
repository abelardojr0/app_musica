import { useState } from "react";

export function useQrScanner() {
  const [scanning, setScanning] = useState(false);
  return { scanning, setScanning };
}
