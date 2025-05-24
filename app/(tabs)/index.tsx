import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function HomeScreen() {
  const { designs, loading, fetchDesigns } = useStore();

  useEffect(() => {
    fetchDesigns();
  }, []);

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading designs...</Text>
        </View>
      </>
    );
  }

  const categories = Array.from(new Set(designs.map((d) => d.category)));
  const featuredDesigns = designs.slice(0, 4);

  // 在末尾追加前两个项目
  const categoryItems = categories.concat(categories.slice(0, 2));
  const featuredItems = featuredDesigns.concat(featuredDesigns.slice(0, 2));

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Card mode="elevated" elevation={4} style={styles.heroCard}>
          <Card.Cover
            source={{
              uri:
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            }}
            style={styles.heroCover}
          />
          <Card.Content style={styles.heroContent}>
            <Title style={styles.heroTitle}>Portfolio</Title>
            <Text style={styles.heroSubtitle}>
              Explore our interior design collection
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rowScroll}
          contentContainerStyle={styles.rowContent}
        >
          {categoryItems.map((category, idx) => {
            const cover =
              designs.find((d) => d.category === category)?.image ||
              'https://via.placeholder.com/150';
            return (
              <Link key={`cat-${idx}`} href="/categories/index" asChild>
                <Card mode="elevated" elevation={2} style={styles.gridCard}>
                  <Card.Cover source={{ uri: cover }} style={styles.cardCover} />
                  <Card.Content style={styles.cardContent}>
                    <Title style={styles.cardTitle}>{category}</Title>
                  </Card.Content>
                </Card>
              </Link>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rowScroll}
          contentContainerStyle={styles.rowContent}
        >
          {featuredItems.map((item, idx) => (
            <Link key={`feat-${idx}`} href={`/detail/${item.id}`} asChild>
              <Card mode="elevated" elevation={2} style={styles.gridCard}>
                <Card.Cover
                  source={{ uri: item.image }}
                  style={styles.cardCover}
                />
                <Card.Content style={styles.cardContent}>
                  <Title style={styles.cardTitle}>{item.title}</Title>
                  <Text style={styles.cardSubtitle}>{item.category}</Text>
                </Card.Content>
              </Card>
            </Link>
          ))}
        </ScrollView>
      </ScrollView>
    </>
  );
}

const CARD_WIDTH = 150;
const CARD_COVER_HEIGHT = 150;
const CARD_TOTAL_HEIGHT = CARD_COVER_HEIGHT + 70; // extra for padding + text

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },

  scrollView: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  heroCard: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  heroCover: {
    height: CARD_COVER_HEIGHT,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  heroContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  heroTitle: { fontSize: 20, marginBottom: 4 },
  heroSubtitle: { fontSize: 14, color: '#666' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  rowScroll: { overflow: 'visible' },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },

  gridCard: {
    width: CARD_WIDTH,
    height: CARD_TOTAL_HEIGHT,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  cardCover: {
    height: CARD_COVER_HEIGHT,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});