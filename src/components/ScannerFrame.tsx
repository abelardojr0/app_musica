import React from "react";
import { View, StyleSheet } from "react-native";

export default function ScannerFrame() {
  return <View pointerEvents="none" style={styles.frame} />;
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    margin: 20,
    borderRadius: 8,
    flex: 1,
  },
});
