import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as detailData from '../../detail_data.json';
import * as listData from '../../list_data.json';

type RootStackParamList = {
  Detail: { project: Project };
};

type Project = {
  title: string;
  description?: string;
  image: string;
  link: string;
  sector: string | string[];
  detailImages: string[];
  detailTexts: string[];
};

type PortfolioListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Detail'>;
};

const PortfolioList = ({ navigation }: PortfolioListProps) => {
  // Combine list and detail data
  const projects = listData.portfolio.map(item => {
    const detail = detailData.projects.find(proj => proj.url === item.link);
    return {
      ...item,
      detailImages: detail?.images || [],
      detailTexts: detail?.texts || []
    };
  });

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { project: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description && <Text style={styles.description}>{item.description}</Text>}
        <View style={styles.sectorContainer}>
          {Array.isArray(item.sector) ? (
            item.sector.map((sector: string, index: number) => (
              <Text key={index} style={styles.sector}>{sector}</Text>
            ))
          ) : (
            <Text style={styles.sector}>{item.sector}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderItem}
        keyExtractor={(item: Project) => item.link}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sector: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#888',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default PortfolioList;
