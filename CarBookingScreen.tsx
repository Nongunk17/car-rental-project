import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Adjust the path
import { handleBooking } from './utils/handleBooking'; // Adjust the path
import { getAuth } from 'firebase/auth';
import moment from 'moment';

type Props = StackScreenProps<RootStackParamList, 'CarBooking'>;

const CarBookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { carId } = route.params;
  const [bookingDate, setBookingDate] = useState('');
  const [userDetails, setUserDetails] = useState({
    firstname: '',
    lastname: '',
    driverLicense: '',
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You must be logged in to book a car.');
      navigation.navigate('Login');
    } else {
      setUserDetails({
        firstname: user.displayName?.split(' ')[0] || '',
        lastname: user.displayName?.split(' ')[1] || '',
        driverLicense: '',
      });
    }
  }, []);

  const handleBookingSubmit = () => {
    if (!moment(bookingDate, 'YYYY-MM-DD', true).isValid()) {
      Alert.alert('Error', 'Invalid date format. Use YYYY-MM-DD.');
      return;
    }
    if (moment(bookingDate).isBefore(moment())) {
      Alert.alert('Error', 'Booking date must be in the future.');
      return;
    }

    if (userDetails.firstname && userDetails.lastname && userDetails.driverLicense) {
      handleBooking(carId, bookingDate, userDetails);
      Alert.alert('Success', 'Car booked successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('RentalHistory') },
      ]);
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Car</Text>
      <TextInput
        style={styles.input}
        placeholder="Booking Date (YYYY-MM-DD)"
        value={bookingDate}
        onChangeText={setBookingDate}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={userDetails.firstname}
        onChangeText={(text) => setUserDetails({ ...userDetails, firstname: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={userDetails.lastname}
        onChangeText={(text) => setUserDetails({ ...userDetails, lastname: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Driver License"
        value={userDetails.driverLicense}
        onChangeText={(text) => setUserDetails({ ...userDetails, driverLicense: text })}
      />
      <Button title="Book" onPress={handleBookingSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default CarBookingScreen;
