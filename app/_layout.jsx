import React from 'react';
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

import GarbageSortPage from './GarbageSort/GarbageSortPage'
import Step1 from './GarbageSort/Step1'
import Step2 from './GarbageSort/Step2'
import Step3 from './GarbageSort/Step3'
import Step4 from './GarbageSort/Step4'
import Step5 from './GarbageSort/Step5'
import Add from './GarbageSort/addStep'

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
            <Stack.Screen name="GarbageSort" component={GarbageSortPage} options={{ headerShown: false }} />
            <Stack.Screen name="Step1" component={Step1} />
            <Stack.Screen name="Step2" component={Step2} />
            <Stack.Screen name="Step3" component={Step3} />
            <Stack.Screen name="Step4" component={Step4} />
            <Stack.Screen name="Step5" component={Step5} />
            <Stack.Screen name="AddStep" component={Add} />
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
        </Stack.Navigator>
    );
}

const _layout = () => {
    return (
        <UserProvider>
            <NavigationContainer independent={true}>
                <StatusBar barStyle="dark-content" backgroundColor="#000000" />
                <Stack.Navigator>
                    <Stack.Screen
                        name="Auth"
                        component={AuthStack}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Main"
                        component={TabsLayout}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
}

export default _layout;
