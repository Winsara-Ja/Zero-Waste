import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View style={styles.container} className="min-h-[85vh]">
                    <Image
                        source={require('../assets/images/logo.jpg')}
                        style={styles.backgroundImage}
                        resizeMode='cover'
                    />
                    <Text className="m-6" style={styles.title}>
                        Welcome to Zero Waste! Let's work together to keep our community clean.
                        Schedule pickups, track your waste, and learn eco-friendly tips – all in one app.
                        Let's make waste management simple and sustainable!
                    </Text>
                    <TouchableOpacity className="bg-slate-50 rounded-md min-h-[40px] min-w-[90px] flex items-center justify-center">
                        <Link href="/GarbageBinList" className="text-black font-bold text-lg">
                            Next
                        </Link>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        zIndex: 1,
    },
});
