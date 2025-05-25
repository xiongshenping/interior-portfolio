import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';

export default function CategoriesScreen() {
    const {
        designs,
        loading,
        fetchDesigns,
        addSavedDesign,
        removeSavedDesign,
        isDesignSaved,
    } = useStore();

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
                renderItem={({ item }) => {
                    const saved = isDesignSaved(item.id);
                    return (
                        <View style={styles.cardWrapper}>
                            <Link href={`/detail/${item.id}`} asChild>
                                <Card style={styles.card}>
                                    <Card.Cover source={{ uri: item.image }} />
                                    <Card.Content>
                                        <Title>{item.title}</Title>
                                        <Text style={styles.subtitle}>{item.category}</Text>
                                    </Card.Content>
                                </Card>
                            </Link>

                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() =>
                                    saved
                                        ? removeSavedDesign(item.id)
                                        : addSavedDesign(item)
                                }
                            >
                                <Ionicons
                                    name={saved ? 'heart' : 'heart-outline'}
                                    size={24}
                                    color="red"
                                />
                            </TouchableOpacity>
                        </View>
                    );
                }}
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
    cardWrapper: {
        flex: 1,
        marginBottom: 16,
        marginHorizontal: 8,
        position: 'relative',
    },
    card: { flex: 1 },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 6,
        elevation: 2,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    row: { justifyContent: 'space-between' },
});
