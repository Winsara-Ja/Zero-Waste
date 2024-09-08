import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import React from 'react'

const index = () => {
    return (
        <View style={styles.container}>
            <Text className="text-3xl font-SpaceMono">Zero Waste</Text>
            <Link href="/home">Go to Profile</Link>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});