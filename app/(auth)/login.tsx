import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function LoginScreen() {
    const { login } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Login Failed', 'Incorrect email or password');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="INTERIOR DESIGNER" titleStyle={styles.header} />
                <Text style={styles.title}>LOG IN</Text>
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
                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Log In
                </Button>
                <Link href="/(auth)/signup" asChild>
                    <Text style={styles.link}>Don't have an account? Sign up</Text>
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
