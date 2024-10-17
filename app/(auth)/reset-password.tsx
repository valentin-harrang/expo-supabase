import { useState } from "react";
import { Alert, Text, TextInput, View, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabaseClient } from "@/services/supabase";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const { access_token } = useLocalSearchParams<{ access_token?: string }>(); // Capture the token from the URL

  const handleResetPassword = async () => {
    if (!access_token) {
      Alert.alert("Error", "Missing or invalid token.");
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
        nonce: access_token as string,
      });

      if (error) throw error;

      Alert.alert("Success", "Your password has been reset.");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Alert.alert("Error", (error as any)?.message);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <View style={{ width: 300, alignSelf: "center" }}>
        <Text>New Password</Text>
        <TextInput
          autoCapitalize="none"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />

        <Button title="Reset Password" onPress={handleResetPassword} />
      </View>
    </View>
  );
}
