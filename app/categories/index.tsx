import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { useEffect } from 'react';

export default function CategoriesScreen() {
    const { designs, loading, fetchDesigns } = useStore();

    useEffect(() => {
        fetchDesigns();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#6200EE" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={designs}
                renderItem={({ item }) => (
                    <Link href={`/detail/${item.id}`} asChild>
                        <Card style={styles.card}>
                            <Card.Cover source={{ uri: item.image }} />
                            <Card.Content>
                                <Title>{item.title}</Title>
                                <Card.Title subtitle={item.category} />
                            </Card.Content>
                        </Card>
                    </Link>
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={styles.row}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    card: { flex: 1, marginBottom: 16, marginHorizontal: 8 },
    row: { justifyContent: 'space-between' },
});