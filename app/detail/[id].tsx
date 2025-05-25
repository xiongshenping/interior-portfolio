import ImageSlider from '@/components/ImageSlider';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Linking from "expo-linking";
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import {
  getDetailImagesByDesignId,
  getDetailTextsByDesignId,
} from '../../utils/database';



export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const {
    favorites,
    selectedDesign,
    loading,
    fetchDesignById,
    addToFavoritesById,
    removeFromFavoritesById
  } = useStore();

  const isFavourite = (id: number) => {
    return favorites.some(item => item.id === id);
  };

  const [images, setImages] = useState<string[]>([]);
  const [texts, setTexts] = useState<string[]>([]);
  const [favourite, setFavourite] = useState<boolean>(isFavourite(Number(id)))

  useEffect(() => {
    if (id) {
      const load = async () => {
        await fetchDesignById(Number(id));
        const imgs = await getDetailImagesByDesignId(Number(id));
        const txts = await getDetailTextsByDesignId(Number(id));
        setImages(imgs.map((i) => i.url));
        setTexts(txts.map((t) => t.content));
      };
      load();
    }
  }, [id]);

  const headerHeight = useHeaderHeight();

  if (loading || !selectedDesign) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text>Loading design details...</Text>
      </SafeAreaView>
    );
  }

  const handleRemoveFavourite = () => {
    removeFromFavoritesById(Number(id));
    setFavourite(false);
  }

  const handleAddFavourite = () => {
    addToFavoritesById(Number(id));
    setFavourite(true);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Design Detail',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                const url = Linking.createURL(`/detail/${id}`);
                await Share.share({ message: `Check this out: ${url}` });
              }}
            >
              <Ionicons name="share-outline" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={{ marginTop: headerHeight }}>
        <ImageSlider images={images.length > 0 ? images : [selectedDesign.image]} />
        <View style={styles.container}>
          <View style={styles.ratingWrapper}>
            <View style={styles.ratingWrapper}>
              <Ionicons name="star" size={20} color="#D4AF37" />
              <Text style={styles.rating}>4.7</Text>
            </View>
            <TouchableOpacity onPress={() => favourite ? handleRemoveFavourite() : handleAddFavourite()}>
              <Ionicons name={favourite ? "heart" : "heart-outline"} size={22} color="red" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{selectedDesign.title}</Text>

          <View style={styles.subtitle}>
            <Text style={styles.subtitlefont}>Overview</Text>
          </View>
          <Text style={styles.description}>{selectedDesign.description}</Text>

          {texts.length > 0 && (
            <>
              <View style={styles.subtitle}>
                <Text style={styles.subtitlefont}>Details</Text>
              </View>
              {texts.map((txt, i) => (
                <Text key={i} style={[styles.description, { marginTop: 12 }]}>
                  {txt}
                </Text>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <View
          style={[
            styles.button,
            { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'flex-start' },
          ]}
        >
          <Text style={styles.price}>Price: $120</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, favourite && {opacity: 0.4}]}
          onPress={async () => {
            await addToFavoritesById(Number(id));
            router.back();
          }}
          disabled={favourite}
        >
          <Text style={styles.buttonText}>Add to Consideration</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  centerContent: { justifyContent: 'center', alignItems: 'center', padding: 16 },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0.6,
    lineHeight: 32,
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  subtitlefont: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    letterSpacing: 0.6,
  },
  buttonWrapper: {
    position: 'absolute',
    height: 90,
    padding: 20,
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#572fff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    gap: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
});
