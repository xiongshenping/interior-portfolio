import { Link } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card } from 'react-native-paper';
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

  const categories = Array.from(
    new Set(
      designs.flatMap((d) =>
        d.category.split(',').map((c) => c.trim().toLowerCase())
      )
    )
  );

  const featuredItems = designs.slice(3, 7);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Hero Section */}
        <Card mode="elevated" elevation={4} style={styles.heroCard}>
          <Card.Cover
            source={{
              uri:
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            }}
            style={styles.heroCover}
          />
          <Card.Content style={styles.heroContent}>
            <Text style={styles.heroTitle}>Portfolio</Text>
            <Text style={styles.heroSubtitle}>
              Explore our interior design collection
            </Text>
          </Card.Content>
        </Card>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rowScroll}
          contentContainerStyle={styles.rowContent}
        >
          {categories.map((category, idx) => {
            const cover = designs.find((d) =>
              d.category.toLowerCase().includes(category)
            )?.image || 'https://via.placeholder.com/150';

            return (
              <Link
                key={`cat-${idx}`}
                href={`/categories/${encodeURIComponent(category)}`}
                asChild
              >
                <Card mode="elevated" elevation={2} style={styles.gridCard}>
                  {/*Wrapped image + overlay title inside View */}
                  <View style={styles.imageWrapper}>
                    <Card.Cover source={{ uri: cover }} style={styles.cardCover} />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{category}</Text>
                    </View>
                  </View>
                </Card>
              </Link>
            );
          })}
        </ScrollView>

        {/* Featured */}
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
                {/*Same image overlay pattern for featured */}
                <View style={styles.imageWrapper}>
                  <Card.Cover source={{ uri: item.image }} style={styles.cardCover} />
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>{item.title}</Text>
                  </View>
                </View>
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
const CARD_TOTAL_HEIGHT = CARD_COVER_HEIGHT;

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
  heroTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
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

  // ⬇️ NEW: for image + overlay title inside card
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: CARD_COVER_HEIGHT,
  },
  cardCover: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
