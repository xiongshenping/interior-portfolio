import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Avatar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { useRouter } from 'expo-router';

const savedDesigns = [
    {
        id: '1',
        title: 'Cozy Apartment',
        subtitle: 'Living Room',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150'
    },
    {
        id: '2',
        title: 'Minimalist Bedroom',
        subtitle: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150'
    },
];

export default function ProfileScreen() {
    const { user, logout } = useStore();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    const getUserDisplayName = () => {
        if (!user) return 'Guest User';
        return user.includes('@') ? user.split('@')[0] : user;
    };

    const getUserEmail = () => {
        if (!user) return 'guest@example.com';
        return user.includes('@') ? user : `${user}@example.com`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileHeader}>
                <Avatar.Image
                    size={80}
                    source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b1e6014c?w=80' }}
                />
                <View style={styles.profileInfo}>
                    <Title>{getUserDisplayName()}</Title>
                    <Text style={styles.email}>{getUserEmail()}</Text>
                </View>
            </View>

            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.button}
                icon="logout"
            >
                Logout
            </Button>

            <Text style={styles.sectionTitle}>Saved Designs</Text>
            <FlatList
                data={savedDesigns}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Cover source={{ uri: item.image }} />
                        <Card.Title title={item.title} subtitle={item.subtitle} />
                    </Card>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileInfo: { marginLeft: 16, flex: 1 },
    email: { color: '#666', fontSize: 14 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
    card: { marginBottom: 16 },
    button: { marginVertical: 16, backgroundColor: '#6200EE' },
});