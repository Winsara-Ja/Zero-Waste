
import React from 'react';
import { Image } from 'react-native';

import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from 'react-native-vector-icons'; // Import Ionicons

import { UserProvider } from './UserContext';

import GarbageBinList from './GarbageSchedule/GarbageBinList';
import CollectedGarbage from './GrabageDriver/CollectedGarbage';
import Garbage from './GarbageSchedule/Garbage';
import Locations from './GrabageDriver/Locations';
import Schedule from './GarbageSchedule/Schedule';
import DriverPickupList from './GrabageDriver/Accept';
import LoginScreen from './LogInScreen';
import SignUpScreen from './SignUpScreen';
import CurrentUserProfile from './ProfileScreen';

import Home from './home';
import DailyTracking from './wasteTracking/DailyTracking';
import WeeklyTracking from './wasteTracking/WeeklyTracking';
import MonthlyTracking from './wasteTracking/MonthlyTracking';
import MonthlyReport from './wasteTracking/MonthlyReport';
import MyQuestions from './wasteTracking/MyQuestions';
import Questions from './wasteTracking/Questions';
import Tips from './wasteTracking/Tips';

import Shop from './shop';
import addpost from './addpost'
// Correct usage of createBottomTabNavigator and createStackNavigator from @react-navigation/stack

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabsLayout() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'DailyTracking') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'GarbageBins') {
                        iconName = focused ? 'trash' : 'trash-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#008080',
                tabBarInactiveTintColor: '#555',
                tabBarStyle: {
                    backgroundColor: '#F7F9FC',
                    borderTopWidth: 1,
                    borderTopColor: '#ddd',
                    height: 60,
                    paddingBottom: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen name="Home" component={StackLayout4} />
            <Tab.Screen name="DailyTracking" component={StackLayout} />
            <Tab.Screen name="GarbageBins" component={ScheduleStack} />
            <Tab.Screen name="Profile" component={StackLayout2} />
        </Tab.Navigator>
    );
}

function StackLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DailyTracking" component={DailyTracking} options={{ headerShown: false }} />
            <Stack.Screen name="WeeklyTracking" component={WeeklyTracking} />
            <Stack.Screen name="MonthlyTracking" component={MonthlyTracking} />
        </Stack.Navigator>
    );
}

function StackLayout2() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfilePage" component={CurrentUserProfile} options={{ headerShown: false }} />
            <Stack.Screen name="Garbage" component={Garbage} />
            {/* Driver Screens */}
            <Stack.Screen name="PickupList" component={DriverPickupList} options={{ headerShown: false }} />
            <Stack.Screen name="Locations" component={Locations} />
            <Stack.Screen name="CollectedGarbage" component={CollectedGarbage} />
        </Stack.Navigator>
    );
}

// function DriverStackLayout() {
//     return (
//         <Stack.Navigator>

//         </Stack.Navigator>
//     );
// }

function StackLayout4() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomePage" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Questions" component={Questions} />
            <Stack.Screen name="MyQuestions" component={MyQuestions} />
            <Stack.Screen name="Tips" component={Tips} />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

function ScheduleStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="GarbageBinList" component={GarbageBinList} options={{ headerShown: false }} />
            <Stack.Screen name="Schedule" component={Schedule} />
            <Stack.Screen name="addpost" component={AddProduct} />
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

