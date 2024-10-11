
import React from 'react';
import { Image } from 'react-native';

import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native'; // Change from 'react-native-web' to 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';  // Correct import for stack navigator

import GarbageBinList from './GarbageBinList';
import Garbage from './Garbage';
import Locations from './Locations';
import Schedule from './Schedule';
import DriverPickupList from './Accept';
import LoginScreen from './LogInScreen';
import SignUpScreen from './SignUpScreen';


import Shop from './shop';
import addpost from './addpost'
// Correct usage of createBottomTabNavigator and createStackNavigator from @react-navigation/stack
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tabs Layout
function TabsLayout() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Garbage" component={Garbage} />
            <Tab.Screen name="GarbageBinList" component={StackLayout} />
            <Tab.Screen name="Locations" component={Locations} />
            <Tab.Screen
        name="shop"
        component={Shop}
        options={{
          title: 'Shop',
          tabBarIcon: () => (
            <Image
              source={require('../assets/images/shop.png')} // Adjust the path as necessary
              style={{ width: 24, height: 24 }} // Set the size of the icon
            />
          ),
        }}
      />
        </Tab.Navigator>
    );
}

// Stack Layout for Garbage Bin Lists and Schedule
function StackLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="GarbageBins" component={GarbageBinList} options={{ headerShown: false }} />
            <Stack.Screen name="Schedule" component={Schedule} />
            <Stack.Screen name="addpost" component={AddProduct} />
        </Stack.Navigator>
    );
}

// Stack Layout for Authentication (Login and SignUp)
function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

// Main Layout
const _layout = () => {
    return (
        <NavigationContainer independent={true}>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator>
                <Stack.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{ headerShown: false }} // Hide header for auth screens
                />
                <Stack.Screen
                    name="Main"
                    component={TabsLayout}
                    options={{ headerShown: false }} // Hide header for main app screens
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default _layout;