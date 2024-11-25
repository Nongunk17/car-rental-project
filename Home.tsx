import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './FirebaseConfig';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const header = require('./assets/header.png');

initializeApp(firebaseConfig);

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [cars, setCars] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const db = getFirestore();
        const carsCollection = collection(db, 'cars');
        const carsSnapshot = await getDocs(carsCollection);
        const carsList = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCars(carsList);
      } catch (error) {
        console.error('Error fetching cars: ', error);
      }
    };

    fetchCars();
  }, []);

  // Show only the first two cars and the Show More card
  const visibleCars = cars.slice(0, 2);

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      // Navigate to ListOfAvailableCars and pass the search query
      navigation.navigate('ListOfAvailableCars', { searchQuery: searchText.trim() });
    } else {
      alert('Please enter a search term.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>VROOM VROOM</Text>
        <Image
          source={header}
          style={{ width: screenWidth, height: screenWidth * 0.6, position: 'absolute', top: 30 }}
        />
        <View style={styles.searchBoxContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for cars..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal contentContainerStyle={styles.carListContainer}>
        {visibleCars.map((car, index) => (
          <View key={index} style={styles.carCard}>
            <Image source={{ uri: car.imageURL }} style={styles.carImage} />
            <View style={styles.carDetails}>
              <Text style={styles.carName}>{car.brand} {car.model}</Text>
              <Text style={styles.carPrice}>{car.price} Baht/Day</Text>
            </View>
          </View>
        ))}

        {/* "Show More" Card as the third card */}
        {cars.length > 2 && (
          <TouchableOpacity 
            style={styles.showMoreCard} 
            onPress={() => navigation.navigate('ListOfAvailableCars')}
          >
            <Text style={styles.showMoreText}>Show More Cars</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={handleSearch}
        >
          <Feather name="search" size={24} color="#AF2030" />
          <Text style={[styles.navText, { color: '#AF2030' }]}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('RentalHistory')}
        >
          <FontAwesome name="car" size={24} color="#AF2030" />
          <Text style={[styles.navText, { color: '#AF2030' }]}>Your Car</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Feather name="user" size={24} color="#AF2030" />
          <Text style={[styles.navText, { color: '#AF2030' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#AF2030',
    flex: 6.5,
    borderWidth: 10,
    borderColor: '#AF2030',
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: '-apple-system',
    position: 'absolute',
    top: 0
  },
  searchBoxContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 275,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingLeft: 10,
  },
  searchButton: {
    backgroundColor: '#AF2030',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 83,
    backgroundColor: 'rgba(248, 248, 248, 0.92)',
    borderTopWidth: 0.5,
    borderTopColor: '#d1d1d1',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#AF2030',
  },
  carListContainer: {
    paddingBottom: 10,
  },
  carCard: {
    width: 240,
    height: 300,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AF2030',
  },
  carImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  carDetails: {
    padding: 10,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  carPrice: {
    fontSize: 16,
    color: '#666',
  },
  showMoreCard: {
    width: 240,
    height: 300,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#AF2030',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    opacity: 0.9,
  },
  showMoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
