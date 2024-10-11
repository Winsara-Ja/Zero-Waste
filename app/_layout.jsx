import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native'; // Change from 'react-native-web' to 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';  // Correct import for stack navigator
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


import Home from './home'
import GarbageSortPage from './GarbageSort/GarbageSortPage'
import Step1 from './GarbageSort/Step1'
import Step2 from './GarbageSort/Step2'
import Step3 from './GarbageSort/Step3'
import Step4 from './GarbageSort/Step4'
import Step5 from './GarbageSort/Step5'
import Add from './GarbageSort/addStep'

import DailyTracking from './wasteTracking/DailyTracking';
import WeeklyTracking from './wasteTracking/WeeklyTracking';
import MonthlyTracking from './wasteTracking/MonthlyTracking';
import MonthlyReport from './wasteTracking/MonthlyReport';
import MyQuestions from './wasteTracking/MyQuestions';
import Questions from './wasteTracking/Questions';
import Tips from './wasteTracking/Tips';


// Correct usage of createBottomTabNavigator and createStackNavigator from @react-navigation/stack
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tabs Layout
function TabsLayout() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>

            <Tab.Screen name="Home" component={Home} />


            <Tab.Screen name="DailyTracking" component={StackLayout} />
            <Tab.Screen name="DriverPickupList" component={DriverStackLayout} />
            <Tab.Screen name="Q/A & Tips" component={StackLayout4} />

            <Tab.Screen name="Profile" component={StackLayout2} />

            <Tab.Screen name="GarbageBinList" component={GarbageBinList} />
        </Tab.Navigator>
    );
}

// Stack Layout for Garbage Bin Lists and Schedule
function StackLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DailyTracking" component={DailyTracking} options={{ headerShown: false }} />
            <Stack.Screen name="Schedule" component={Schedule} />
            <Stack.Screen name="GarbageBins" component={GarbageBinList} options={{ headerShown: false }} />
            <Stack.Screen name="GarbageSort" component={GarbageSortPage} />
            <Stack.Screen name="Step1" component={Step1} />
            <Stack.Screen name="Step2" component={Step2} />
            <Stack.Screen name="Step3" component={Step3} />
            <Stack.Screen name="Step4" component={Step4} />
            <Stack.Screen name="Step5" component={Step5} />
            <Stack.Screen name="AddStep" component={Add} />

            <Stack.Screen name="WeeklyTracking" component={WeeklyTracking} />
            <Stack.Screen name="MonthlyTracking" component={MonthlyTracking} />
            <Stack.Screen name="MonthlyReport" component={MonthlyReport} />

        </Stack.Navigator>
    );
}

function StackLayout2() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfilePage" component={CurrentUserProfile} options={{ headerShown: false }} />
            <Stack.Screen name="Garbage" component={Garbage} />
        </Stack.Navigator>
    );
}

function DriverStackLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="PickupList" component={DriverPickupList} options={{ headerShown: false }} />
            <Stack.Screen name="Locations" component={Locations} />
            <Stack.Screen name="CollectedGarbage" component={CollectedGarbage} />
        </Stack.Navigator>
    );
}

function StackLayout4() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Questions" component={Questions} />
            <Stack.Screen name="MyQuestions" component={MyQuestions} />
            <Stack.Screen name="Tips" component={Tips} />
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
        <UserProvider>
            <NavigationContainer independent={true}>
                <StatusBar barStyle="dark-content" backgroundColor="#000000" />
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
        </UserProvider>
    )
}

export default _layout;
