import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = { status: string; type?: "normal" | "error" };
export default function StatusBadge({ status, type = "normal" }: Props) {
  return (
    <View
      style={[
        styles.badge,
        type === "error" ? styles.errorBadge : styles.normalBadge,
      ]}
    >
      <Text
        style={[styles.text, type === "error" ? styles.errorText : undefined]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  normalBadge: { backgroundColor: "#eee" },
  errorBadge: { backgroundColor: "#f8d7da" },
  text: { color: "#333" },
  errorText: { color: "#8b0000" },
});
