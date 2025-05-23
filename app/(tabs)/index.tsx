import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useStore } from '../../store/useStore';

export default function HomeScreen() {
    const { designs, loading, fetchDesigns } = useStore();

    useEffect(() => {
        fetchDesigns();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text style={styles.loadingText}>Loading designs...</Text>
            </SafeAreaView>
        );
    }

    const categories = [...new Set(designs.map(design => design.category))];
    const featuredDesigns = designs.slice(0, 4);

    return (
        <SafeAreaView style={styles.container}>
            <Card style={styles.heroCard}>
                <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' }} />
                <Card.Title title="Portfolio" subtitle="Explore our interior design collection" />
            </Card>

            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
                data={categories.map(category => ({ category, id: category }))}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Link href="/categories/index" asChild>
                        <Card style={styles.categoryCard}>
                            <Card.Cover source={{
                                uri: designs.find(d => d.category === item.category)?.image || 'https://via.placeholder.com/150'
                            }} />
                            <Card.Title title={item.category} />
                        </Card>
                    </Link>
                )}
                keyExtractor={(item) => item.id}
            />

            <Text style={styles.sectionTitle}>Featured</Text>
            <FlatList
                data={featuredDesigns}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Link href={`/detail/${item.id}`} asChild>
                        <Card style={styles.categoryCard}>
                            <Card.Cover source={{ uri: item.image }} />
                            <Card.Title title={item.title} subtitle={item.category} />
                        </Card>
                    </Link>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    heroCard: { marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
    categoryCard: { width: 150, marginRight: 16 },
});