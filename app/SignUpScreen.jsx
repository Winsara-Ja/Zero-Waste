import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { signUp } from './authService'; // Adjust path as needed

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSignUp = async () => {
        try {
            const user = await signUp(email, password, name);
            Alert.alert('Sign Up Successful!', `Welcome ${user.email}`);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/bg1.png')} // Replace with the correct path
            style={styles.background}
        >
            <View style={styles.container}>
                {/* Placeholder for the logo */}
                <Image source={require('../assets/images/logo1.png')} style={styles.logo} />

                <Text style={styles.title}>Create an Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#555"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#555"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#555"
                />

                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60, // Make the logo round
        marginBottom: 30,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#008080',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#008080',
        borderWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        borderRadius: 8,
        color: '#333',
    },
    signUpButton: {
        backgroundColor: '#008080',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#008080',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default SignUpScreen;
