import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
            <Button
                title="Go to Shop"
                onPress={() => navigation.navigate('shop')}
            />
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
