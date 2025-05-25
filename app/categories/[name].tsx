import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CategoryScreen() {
  const { name } = useLocalSearchParams();
  const { designs, loading, fetchDesignsByCategory } = useStore();

  useEffect(() => {
    if (name) {
      fetchDesignsByCategory(decodeURIComponent(String(name)));
    }
  }, [name]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6200EE" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: capitalize(String(name)), // Show "Hospitality" in the top bar
          headerBackTitle: 'Back',        // Show "Back" instead of "(tabs)"
        }}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Category: {capitalize(String(name))}</Text>
        <FlatList
          data={designs}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Link href={`/detail/${item.id}`} asChild>
              <Card mode="elevated" style={styles.card}>
                <Card.Cover source={{ uri: item.image }} />
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Text>{item.description}</Text>
                </Card.Content>
              </Card>
            </Link>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', padding: 16 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { marginBottom: 16, borderRadius: 10 },
});
