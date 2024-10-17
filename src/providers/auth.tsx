import React, { useEffect, useState } from "react";
import {
  login,
  createAccount,
  logout,
} from "@/services/supabase";
import { AuthError, User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase";

const AuthContext = React.createContext<{
  resetPassword: (email: string) => Promise<{
      data: {};
      error: null;
  } | {
      data: null;
      error: AuthError;
  }> | undefined;
  signIn: (
    email: string,
    password: string
  ) => Promise<User | undefined> | undefined;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<User | undefined> | undefined;
  signOut: () => void;
  isLoading: boolean;
  user?: User | undefined;
}>({
  resetPassword: () => undefined,
  signIn: () => undefined,
  signUp: () => undefined,
  signOut: () => null,
  isLoading: false,
  user: undefined,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    /**
     * Initialize the component
     */
    async function init() {
      try {
        const response = await supabaseClient.auth.getUser();
        setUser(response?.data?.user!);
        setIsLoading(false);
      } catch (e) {
        console.log("[error getting user] ==>", e);
        setIsLoading(false);
      }
    }
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        resetPassword: async (email: string) => {
          try {
            const response = await supabaseClient.auth.resetPasswordForEmail(
              email, {
              redirectTo: `${process.env.EXPO_PUBLIC_APP_URL as string}/reset-password`,
            });
            return response;
          }  catch (error) {
            return { data: null, error: error as AuthError };
          }
        },
        signIn: async (email: string, password: string) => {
          try {
            // Perform sign-in logic here
            const response = await login(email, password);
            setUser(response?.data!);
            setIsLoading(false);
            if (response?.error) {
              throw response?.error;
            }
            return response?.data;
          } catch (error) {
            console.log("session ctx error", error);
            return undefined;
          }
        },
        signUp: async (email: string, password: string, name?: string) => {
          // Perform sign-up logic here
          const response = await createAccount(email, password, name!);
          setUser(response?.data!);
          setIsLoading(false);
          return response?.data!;
        },
        signOut: async () => {
          // Perform sign-out logic here
          await logout();
          setUser(undefined);
          setIsLoading(false);
        },
        isLoading,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
