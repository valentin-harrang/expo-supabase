import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";

const TabHomeLayout = () => (
  <Stack
    screenOptions={{
      headerShown: true,
      headerTitle: "Images",
      title: "Images",
      headerLeft: () => <DrawerToggleButton />,
    }}
  />
);

export default TabHomeLayout;