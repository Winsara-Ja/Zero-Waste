import React, { useEffect } from 'react';
import { Slot, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [fontsLoaded, error] = useFonts({
        "SpaceMono": require('../assets/fonts/SpaceMono-Regular.ttf'),
        "RighteousRegular": require('../assets/fonts/Righteous-Regular.ttf'),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    if (!fontsLoaded) return null;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            {/* Add other screens here if needed */}
        </Stack>
    );
}
