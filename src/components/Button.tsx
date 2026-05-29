import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Button({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style as any]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  text: { color: "#fff", fontWeight: "600" },
});
