import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function DetailScreen() {
    const { id } = useLocalSearchParams();
    const { selectedDesign, loading, fetchDesignById } = useStore();

    useEffect(() => {
        if (id) {
            fetchDesignById(Number(id));
        }
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text>Loading design details...</Text>
            </SafeAreaView>
        );
    }

    if (!selectedDesign) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text>Design not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Cover source={{ uri: selectedDesign.image }} style={styles.cardCover} />
                    <Card.Content style={styles.cardContent}>
                        <Title style={styles.title}>{selectedDesign.title}</Title>
                        <Text style={styles.categoryText}>Category: {selectedDesign.category}</Text>
                        <Paragraph style={styles.description}>{selectedDesign.description}</Paragraph>
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centerContent: { justifyContent: 'center', alignItems: 'center', padding: 16 },
    card: { margin: 16, elevation: 4, borderRadius: 8 },
    cardCover: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    cardContent: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    categoryText: { fontSize: 16, color: 'gray', marginBottom: 12, fontStyle: 'italic' },
    description: { fontSize: 16, lineHeight: 24 },
});