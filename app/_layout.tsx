import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { useStore } from '../store/useStore';
import { initDatabase } from '../utils/database';

export default function RootLayout() {
    const { user } = useStore();
    const router = useRouter();
    const segments = useSegments();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            await initDatabase();
            setIsReady(true);
        };
        initialize();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0]?.startsWith('(auth)');

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, segments, isReady]);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <PaperProvider>
            <Stack>
                {/*<Stack.Screen name="(auth)" options={{ headerShown: false }} />*/}
                <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="categories/index"
                    options={{
                        headerShown: true,
                        title: 'Categories',
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="detail/index"
                    options={{
                        headerShown: true,
                        title: 'Detail',
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </PaperProvider>
    );
}
