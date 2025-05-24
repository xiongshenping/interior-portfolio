import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    Avatar,
    Button,
    Card,
    Divider,
    List,
    Title,
} from 'react-native-paper';
import { useStore } from '../../store/useStore';

const savedDesigns = [
  {
    id: '1',
    title: 'Cozy Apartment',
    subtitle: 'Living Room',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150',
  },
  {
    id: '2',
    title: 'Minimalist Bedroom',
    subtitle: 'Bedroom',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150',
  },
];

export default function ProfileScreen() {
  const { user, logout } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const getUserDisplayName = () =>
    !user ? 'Guest User' : user.includes('@') ? user.split('@')[0] : user;

  const getUserEmail = () =>
    !user ? 'guest@example.com' : user.includes('@') ? user : `${user}@example.com`;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={80}
            source={{
              uri:
                'https://images.unsplash.com/photo-1494790108755-2616b1e6014c?w=80',
            }}
          />
          <View style={styles.profileInfo}>
            <Title>{getUserDisplayName()}</Title>
            <Text style={styles.email}>{getUserEmail()}</Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <List.Section>
            <List.Subheader>INFORMATION</List.Subheader>
            <List.Item
              title="About Us"
              left={(props) => (
                <List.Icon {...props} icon="information-outline" />
              )}
              onPress={() =>
                Alert.alert('About Us', 'This is an interior design app.')
              }
            />
            <Divider />
            <List.Item
              title="Contact Us"
              left={(props) => <List.Icon {...props} icon="email-outline" />}
              onPress={() =>
                Alert.alert(
                  'Contact Us',
                  'Reach out to us at support@example.com'
                )
              }
            />
          </List.Section>
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
        {savedDesigns.map((item) => (
          <Card style={styles.card} key={item.id}>
            <Card.Cover source={{ uri: item.image }} />
            <Card.Title title={item.title} subtitle={item.subtitle} />
          </Card>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  profileHeader: {
    marginBottom: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  email: {
    color: '#666',
    fontSize: 14,
  },
  settingsCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  button: {
    marginVertical: 16,
    backgroundColor: '#6200EE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
});
