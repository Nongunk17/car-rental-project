import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './FirebaseConfig'; // Import your Firebase config

const RentalHistoryScreen: React.FC = () => {
  const [rentedCars, setRentedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore(app); // Initialize Firestore

  useEffect(() => {
    const fetchRentalHistory = async () => {
      setLoading(true);
      try {
        // Get the current user ID
        const user = auth.currentUser;
        if (user) {
          // Fetch bookings from Firestore
          const bookingsRef = collection(db, 'bookings');
          const q = query(bookingsRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          // Create an array of rental data with car information fetched using carId
          const rentalData = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const bookingData = doc.data();
            const carRef = collection(db, 'cars');
            // Query car collection to get the car data based on carId from the booking
            const carQuery = query(carRef, where('carId', '==', bookingData.carId));
            const carQuerySnapshot = await getDocs(carQuery);
            const carData = carQuerySnapshot.docs[0]?.data(); 
            
            return {
              ...bookingData,
              carBrand: carData?.brand,
              carModel: carData?.model,
              carColor: carData?.color,
              carImage: carData?.imageURL,
            };
          }));

          setRentedCars(rentalData);
        } else {
          console.log('No user logged in');
        }
      } catch (error) {
        console.error('Error fetching rental history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, [auth.currentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>List of Your Rented Cars</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#AF2030" />
      ) : rentedCars.length > 0 ? (
        <FlatList
          data={rentedCars}
          keyExtractor={(item) => item.carId}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.carImage }} style={styles.carImage} />
              <Text style={styles.carModel}>{item.carBrand} {item.carModel}</Text>
              <Text style={styles.carColor}>Color: {item.carColor}</Text>
              <Text style={styles.rentalDate}>Rental Date: {item.returndate}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No rental history found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
    marginTop: 70,
    marginLeft: 10,
    marginBottom: 35,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#94A1B2',
    padding: 20,
    marginTop: 5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 330,
    height: 260,
    alignSelf: 'center',
  },
  carImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  carModel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  carColor: {
    fontSize: 14,
    color: '#94A1B2',
    textAlign: 'left',
    marginTop: 5,
  },
  rentalDate: {
    fontSize: 14,
    color: '#94A1B2',
    textAlign: 'left',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    color: '#AF2030',
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 5,
  },
  expectedReturnDate: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 5,
  },
  availability: {
    fontSize: 14,
    color: '#94A1B2',
    textAlign: 'left',
    marginTop: 5,
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#AF2030',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginLeft: -5,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RentalHistoryScreen;
