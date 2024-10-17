import { router } from "expo-router";
import { Alert, View } from "react-native";
import { useSession } from "@/providers/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredField } from "@/components/RequiredField";

const SignIn = () => {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const user = await signIn(email, password);

      if (user) {
        router.replace("/(app)/(drawer)/dashboard");
      }
      else {
        Alert.alert("Sign In Error", "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Sign In Error", (error as any)?.message);
    }
  }

  const handleSignUp = () => {
    router.replace("/(auth)/sign-up");
  }

  const handleForgotPassword = () => {
    router.replace("/(auth)/forgot-password");
  }

  return (
    <View className="justify-center items-center h-full">
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Rejoindre le club</CardTitle>
        </CardHeader>

        <CardContent className="gap-4">
          <View className="gap-2">
            <Label>Email <RequiredField /></Label>
            <Input
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Ex : jean.dupont@gmail.com"
            />
          </View>

          <View className="gap-2">
            <Label>Mot de passe <RequiredField /></Label>
            <Input
              autoCapitalize="none"
              spellCheck={false}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="***********"
            />
          </View>

          <View className="gap-2">
            <Button 
              onPress={handleSignIn}>
              <Text>
                Connexion
              </Text>
            </Button>

            <Button onPress={handleSignUp} variant="secondary">
              <Text>
                Créer un compte
              </Text>
            </Button>
          </View>

          <Button variant="link" onPress={handleForgotPassword} className="mt-4">
            <Text>
              Mot de passe oublié ?
            </Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}

export default SignIn;