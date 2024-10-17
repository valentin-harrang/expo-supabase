import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";

const TabHomeLayout = () => (
  <Stack
    screenOptions={{
      headerShown: true,
      headerTitle: "Home",
      title: "Home",
      headerLeft: () => <DrawerToggleButton />,
    }}
  />
);

export default TabHomeLayout;