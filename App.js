import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-gesture-handler';
import LeftSidebar from './src/components/LeftSidebar';
import RightSidebar from './src/components/RightSidebar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MainScreen from './src/screens/MainScreen';
import ResponseDetailScreen from './src/screens/ResponseDetailScreen';

const LeftDrawer = createDrawerNavigator();
const RightDrawer = createDrawerNavigator();
const Stack = createStackNavigator();

// 3. The innermost Stack (Chat + Details)
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chat" component={MainScreen} />
      <Stack.Screen
        name="ResponseDetail"
        component={ResponseDetailScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

// 2. The Right Drawer wraps the Stack
function RightDrawerScreen() {
  return (
    <RightDrawer.Navigator
      id="RightDrawer"
      drawerContent={(props) => <RightSidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: { width: 300 },
      }}
    >
      <RightDrawer.Screen name="MainStack" component={MainStack} />
    </RightDrawer.Navigator>
  );
}

// 1. The Left Drawer wraps the Right Drawer
function AuthenticatedApp() {
  return (
    <LeftDrawer.Navigator
      id="LeftDrawer"
      drawerContent={(props) => <LeftSidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerStyle: { width: 300 },
        swipeEnabled: false,
      }}
    >
      <LeftDrawer.Screen name="AuraHome" component={RightDrawerScreen} />
      <LeftDrawer.Screen name="Dashboard" component={DashboardScreen} />
    </LeftDrawer.Navigator>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AuthenticatedApp /> : <AuthScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}