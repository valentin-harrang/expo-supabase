import "react-native-url-polyfill/auto";
import * as ImagePicker from "expo-image-picker";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase";

export interface SignInResponse {
  data: User | undefined;
  error: Error | undefined;
}

export interface SignOutResponse {
  error: any | undefined;
  data: {} | undefined;
}

export interface StorageObject {
  fullPath: string;
  id: string;
  path: string;
}
export interface ImageUploadResponse {
  data: StorageObject | undefined;
  error: Error | undefined;
}

export const login = async (
  email: string,
  password: string
): Promise<SignInResponse> => {
  try {
    console.log(email, password);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return { data: data?.user, error: undefined };
  } catch (error) {
    return { error: error as Error, data: undefined };
  }
};

export const createAccount = async (
  email: string,
  password: string,
  username: string
): Promise<SignInResponse> => {
  try {
    const { error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw new Error(signUpError.message);

    const { data, error: updateErr } = await supabaseClient.auth.updateUser({
      data: { username },
    });
    if (updateErr) throw new Error(updateErr.message);

    return { data: data?.user as User, error: undefined };
  } catch (error) {
    console.log("createAccount error", error);
    return { error: error as Error, data: undefined };
  }
};

export const logout = async (): Promise<SignOutResponse> => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw new Error(error.message);
    return { error: undefined, data: {} };
  } catch (error) {
    return { error: error as Error, data: undefined };
  }
};

export const uploadToSupabase = async (
  isPublic = true,
  { uri, mimeType, fileName }: ImagePicker.ImagePickerAsset
): Promise<ImageUploadResponse> => {
  try {
    let formData = new FormData();
    let name;

    if (uri.startsWith("file://")) {
      name = uri.split("/").pop() as string;

      const photo = {
        uri: uri,
        type: mimeType,
        name: name,
      };

      formData.append("file", photo as any);
    } else {
      name = fileName!;

      // when on web
      const fetchResponse = await fetch(uri);
      const blob = await fetchResponse.blob();
      formData.append("file", new File([blob], name, { type: mimeType! }));
    }

    const withoutSpaces = name.replace(/\s/g, "_");

    // upload the image to the storage bucket
    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload(encodeURIComponent(withoutSpaces), formData, {
        upsert: false,
      });
    if (error) throw new Error(error.message);
    const uploadData = data as StorageObject;
    console.log("[image uploaded to storage] ==>", uploadData);

    // get current user
    const { data: getUserData, error: getUserError } =
      await supabaseClient.auth.getUser();
    if (getUserError) throw new Error(getUserError.message);

    // insert the image into the images table using the user's id
    const { data: imageData, error: imageError } = await supabaseClient
      .from("images")
      .insert([
        {
          name: withoutSpaces,
          url: data?.path,
          is_public: isPublic,
          owner_id: getUserData?.user?.id,
          object_id: uploadData.id,
        } as Tables<"images">,
      ]);
    if (imageError) throw new Error(imageError.message);
    console.log("[image inserted into table] ==>", imageData);

    // return the image data on success
    return { data: imageData?.[0] ?? undefined, error: undefined };
  } catch (error) {
    console.log("uploadToSupabase error", error);
    return { error: error as Error, data: undefined };
  }
};

export const imagesFetcher = async (): Promise<{
  data: Tables<"images">[] | undefined;
  error: Error | undefined;
}> => {
  try {
    const { data, error } = await supabaseClient.from("images").select("*");
    if (error) throw new Error(error.message);

    return { data: data as Tables<"images">[], error: undefined };
  } catch (error) {
    console.log("imagesFetcher error", error);
    return { error: error as Error, data: undefined };
  }
};

export const getImage = async (
  url: string,
  width?: number,
  height?: number
): Promise<{ signedUrl: string } | null> => {
  try {
    const { data, error } = await supabaseClient.storage
      .from("images")
      .createSignedUrl(url, 120, {
        download: false,
        transform: {
          resize: "contain",
          width,
          height,
          quality: 100,
        },
      });
    if (error) throw new Error(error.message);
    return data as { signedUrl: string } | null;
  } catch (error) {
    console.error("[getImage:createSignedUrl] ==> ", url, error);
    return null;
  }
};
