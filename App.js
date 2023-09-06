import { GestureHandlerRootView } from "react-native-gesture-handler";

import MainScreen from "./MainScreen";
import CreateNoteScreen from "./CreateNoteScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Page1">
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateNoteScreen"
            component={CreateNoteScreen}
            options={{
              headerShown: true,
              title: "Note",
              headerStyle: {
                backgroundColor: "#1F1F1F",
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontSize: 24,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
