import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';

export const options = {
  headerShown: false,
};

export default function LoginScreen() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>LOG IN</Text>

          <TextInput
            label="Email"
            mode="flat"
            textColor="#fff"
            left={<TextInput.Icon icon="email" color="white" />}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            underlineColor="transparent"
            theme={{ colors: { primary: '#BB86FC' } }}
          />

          <TextInput
            label="Password"
            mode="flat"
            textColor="#fff"
            left={<TextInput.Icon icon="lock" color="white" />}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            underlineColor="transparent"
            theme={{ colors: { primary: '#BB86FC' } }}
          />

          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Log In
          </Button>

          <Text onPress={() => router.replace('/(auth)/signup')} style={styles.link}>
            Don't have an account? Sign up
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  imageStyle: {
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#BB86FC',
    borderRadius: 30,
    paddingVertical: 8,
  },
  link: {
    textAlign: 'center',
    color: '#BB86FC',
    marginTop: 16,
  },
});
