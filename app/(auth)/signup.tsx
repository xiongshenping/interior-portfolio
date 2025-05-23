import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useStore } from '../../store/useStore';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useStore();
    const router = useRouter();

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        const success = await register(email, password);
        if (success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Registration Failed', 'Email may already be registered');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="INTERIOR DESIGNER" titleStyle={styles.header} />
                <Text style={styles.title}>SIGN UP</Text>
                <TextInput
                    label="Email"
                    mode="outlined"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    label="Password"
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    label="Confirm Password"
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <Button mode="contained" onPress={handleSignUp} style={styles.button}>
                    Sign Up
                </Button>
                <Link href="/(auth)/login" asChild>
                    <Text style={styles.link}>Already have an account? Log in</Text>
                </Link>
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f5f5f5' },
    card: { padding: 16, borderRadius: 10 },
    header: { fontSize: 14, color: 'gray', textAlign: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
    input: { marginVertical: 8 },
    button: { marginVertical: 16, backgroundColor: '#6200EE' },
    link: { textAlign: 'center', color: '#6200EE' },
});
