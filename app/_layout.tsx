import { Slot } from "expo-router";
import { SessionProvider } from "@/providers/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Network from 'expo-network';
import { Alert } from "react-native";

(async () => {
  const networkState = await Network.getNetworkStateAsync();

  if (!networkState.isConnected) { 
    Alert.alert("No Internet Connection", "Please connect to the internet to use this app", [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);
    return;
  }
})();

export default function Root() {
  const client = new QueryClient();

  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={client}>
        <Slot />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
