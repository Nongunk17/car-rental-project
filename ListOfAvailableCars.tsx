import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './FirebaseConfig';
import { initializeApp } from 'firebase/app';
import { Calendar } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';


initializeApp(firebaseConfig);

type RootStackParamList = {
  ListOfAvailableCars: undefined;
  RentConfirm: { carId: string };
};

type ListOfAvailableCarsScreenProp = StackNavigationProp<RootStackParamList, 'ListOfAvailableCars'>;


const ListOfAvailableCars: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString()
  );
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  // Fetch cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const db = getFirestore();
        const carsCollection = collection(db, 'cars');
        const carsSnapshot = await getDocs(carsCollection);
        const carsList = carsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          imageUrl: doc.data().imageURL || 'https://via.placeholder.com/150', // Fallback image
        }));
        setCars(carsList);
        setFilteredCars(carsList);
      } catch (error) {
        console.error('Error fetching cars: ', error);
      }
    };

    fetchCars();
  }, []);

  const searchCars = () => {
    if (searchText.trim() === '') {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter((car) =>
        `${car.brand} ${car.model}`.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  };

  useEffect(() => {
    searchCars();
  }, [searchText]);

  const onDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setIsCalendarVisible(false);
  };

  const handleCarSelect = (car: any) => {
    setSelectedCar(car);
    setIsModalVisible(true);
    navigation.navigate('ConfirmRent', { carId: car.id })
  };

  const handleBookNow = () => {
    navigation.navigate('ConfirmRent', { carId: selectedCar.id , carDetails: selectedCar, date: selectedDate });
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.header}>List of Available Cars</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for available cars..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Feather name="search" size={20} color="#fff" style={styles.searchButton} />
      </View>
      <TouchableOpacity
        style={styles.dateInputContainer}
        onPress={() => setIsCalendarVisible(true)}
      >
        <Text style={styles.dateText}>Selected Date: {selectedDate}</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isCalendarVisible}
        animationType="fade"
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDateSelect}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#AF2030',
                  selectedTextColor: 'white',
                },
              }}
              monthFormat={'yyyy MM'}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.carListContainer}>
        {filteredCars.map((car, index) => (
          <View key={index} style={styles.carCard}>
            <Image source={{ uri: car.imageUrl }} style={styles.carImage} />
            <View style={styles.carDetails}>
              <Text style={styles.carName}>
                {car.brand} {car.model}
              </Text>
              <Text style={styles.carPrice}>{car.price} Baht/Day</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleCarSelect(car)}
              >
                <Text style={styles.detailsButtonText}>Show Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {filteredCars.length === 0 && (
          <Text style={styles.noResults}>No cars found for "{searchText}"</Text>
        )}
      </ScrollView>
      {selectedCar && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.detailsModal}>
              <Image
                source={{ uri: selectedCar.imageUrl }}
                style={styles.modalCarImage}
              />
              <Text style={styles.carName}>
                {selectedCar.brand} {selectedCar.model}
              </Text>
              <Text style={styles.carPrice}>{selectedCar.price} Baht/Day</Text>
              <Text style={styles.modalDescription}>{selectedCar.description}</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBookNow}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: '-apple-system',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
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
  dateInputContainer: {
    backgroundColor: '#AF2030',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8f8f8',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  closeButton: {
    backgroundColor: '#AF2030',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  carListContainer: {
    paddingBottom: 80, // Add space at the bottom to avoid the nav bar overlap
  },
  carCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    padding: 10,
    borderWidth: 1,
    borderColor: '#666',
  },
  carImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  carDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carPrice: {
    fontSize: 16,
    color: '#AF2030',
  },
  detailsButton: {
    backgroundColor: '#AF2030',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
  modalCarImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsModal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#AF2030',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ListOfAvailableCars;
