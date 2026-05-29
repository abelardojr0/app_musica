import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ScannerScreen from "../screens/ScannerScreen";
import PlayerControlScreen from "../screens/PlayerControlScreen";

export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  Player: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Music Timeline Scanner" }}
      />
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: "Scanner" }}
      />
      <Stack.Screen
        name="Player"
        component={PlayerControlScreen}
        options={{ title: "Player" }}
      />
    </Stack.Navigator>
  );
}
