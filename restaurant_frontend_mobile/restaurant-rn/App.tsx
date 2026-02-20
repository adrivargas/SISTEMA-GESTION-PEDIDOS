import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MenusScreen from "./src/screens/MenusScreen";
import OrderEventsScreen from "./src/screens/OrderEventsScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Menus: undefined;
  OrderEvents: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Iniciar sesión" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Restaurante" }} />
        <Stack.Screen name="Menus" component={MenusScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="OrderEvents" component={OrderEventsScreen} options={{ title: "Eventos" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
