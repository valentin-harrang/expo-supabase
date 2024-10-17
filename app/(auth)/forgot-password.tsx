import { router } from "expo-router";
import { Alert, Text, TextInput, View } from "react-native";
import { useSession } from "@/providers/auth";
import { useState } from "react";

export default function ForgotPassword() {
  const { resetPassword } = useSession();
  const [email, setEmail] = useState("");

  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <View style={{ width: 300, alignSelf: "center" }}>
        <Text>Email</Text>
        <TextInput
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />

        <Text
          style={{ marginTop: 16 }}
          onPress={async () => {
            try {
              const response = await resetPassword(email);
              if (response?.error) {
                throw response.error;
              }
              Alert.alert(
                "Check your email",
                "A link to reset your password has been sent to your email address."
              );
              router.replace("/(auth)/sign-in"); // Redirect to the sign-in page after success
            } catch (error) {
              Alert.alert("Reset Password Error", (error as any)?.message);
            }
          }}
        >
          Reset Password
        </Text>

        <Text
          style={{ marginTop: 16 }}
          onPress={() => {
            router.replace("/(auth)/sign-in"); // Navigate back to sign-in
          }}
        >
          Go To Sign In
        </Text>
      </View>
    </View>
  );
}
