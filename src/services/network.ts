import { Alert } from 'react-native';
import * as Network from 'expo-network';

export const checkInternetConnection = async () => {
  const networkState = await Network.getNetworkStateAsync();
  if (!networkState.isConnected) {
    Alert.alert("No Internet Connection", "Please connect to the internet to use this app", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
    return false;
  }
  return true;
};
