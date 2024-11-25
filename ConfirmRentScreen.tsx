import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Linking, Modal, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from 'react-native-vector-icons';
import { Calendar } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from './FirebaseConfig'; 
import { useRoute, RouteProp} from '@react-navigation/native';

type RootStackParamList = {
  ConfirmRent: { carId: string };
};

type ConfirmRentScreenRouteProp = RouteProp<RootStackParamList, 'ConfirmRent'>;

function ConfirmRentScreen() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [returndate, setReturndate] = useState(new Date());
  const [licensenumber, setLicensenumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const route = useRoute<ConfirmRentScreenRouteProp>();
  const { carId } = route.params;

  const auth = getAuth();
  const db = getFirestore(app); // Initialize Firestore

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      setPermissionStatus(status);
    };
    checkPermission();
  }, []);

  const onDateSelect = (date: any) => {
    const selectedDate = new Date(date.dateString);
    setReturndate(selectedDate);
    setIsCalendarVisible(false);
  };

  const handlePhotoUpload = async () => {
    const { granted, status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPermissionStatus(status);

    if (!granted) {
      if (status === 'denied') {
        Alert.alert(
          'Permission Denied',
          'We need permission to access your camera roll. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0].uri);
      console.log('Selected photo URI: ', result.assets[0].uri);
    }
  };

  const handleBookingSubmit = async () => {
    if (firstname && lastname && licensenumber && returndate) {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to book a car.');
        return;
      }

      const bookingData = {
        firstname,
        lastname,
        licensenumber,
        returndate: returndate.toISOString(), 
        carId: carId, 
        userId: user.uid,
        photo: photo ? photo : 'mock-photo-url',
      };

      try {
        // Save the booking data to Firestore
        await setDoc(doc(db, 'bookings', `${user.uid}_${Date.now()}`), bookingData);
        Alert.alert('Booking Confirmed', 'Your car booking is confirmed!');
      } catch (error) {
        console.error('Error saving booking:', error);
        Alert.alert('Error', 'There was an issue confirming your booking. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Confirm Rent</Text>

      <Text style={styles.displayText}>First name</Text>
      <TextInput
        placeholder="Firstname"
        value={firstname}
        onChangeText={setFirstname}
        style={styles.input}
      />

      <Text style={styles.displayText}>Last name</Text>
      <TextInput
        placeholder="Lastname"
        value={lastname}
        onChangeText={setLastname}
        style={styles.input}
      />

      <Text style={styles.displayText}>Expected Return Car Date</Text>
      <View style={styles.dateInputContainer}>
        <TouchableOpacity
          style={styles.dateTextContainer}
          onPress={() => setIsCalendarVisible(true)}
        >
          <Text style={styles.dateText}>
            {returndate ? returndate.toLocaleDateString() : 'Select a return date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCalendarVisible(true)} style={styles.iconContainer}>
          <Ionicons name="calendar" size={24} color="#AF2030" />
        </TouchableOpacity>
      </View>

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
                [returndate.toLocaleDateString()]: {
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

      <Text style={styles.displayText}>Driver license number</Text>
      <TextInput
        placeholder="Driver license number"
        value={licensenumber}
        onChangeText={setLicensenumber}
        style={styles.input}
      />

      <View style={styles.text}>
        <Text>Add photo</Text>
        <TouchableOpacity onPress={handlePhotoUpload}>
          <Text style={styles.uploadText}>upload</Text>
        </TouchableOpacity>
      </View>

      {photo && <Text style={styles.successUploadText}>Photo successfully uploaded!</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleBookingSubmit}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'semibold',
    textAlign: 'center',
    color: '#000000',
    marginTop: -30,
    marginBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    height: 42,
    width: 329,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 13,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  displayText: {
    marginTop: 10,
    marginLeft: 13,
    marginBottom: 5,
    fontSize: 13,
  },
  successUploadText: {
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 13,
    color: '#CC7722',
  },
  button: {
    height: 50,
    width: 329,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AF2030',
    borderRadius: 10,
    marginTop: 50,
    marginLeft: 13,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    color: '#16161A',
    marginLeft: 20,
  },
  uploadText: {
    color: '#AF2030',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginLeft: 7,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 13,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 12,
    marginRight: 16,
    marginBottom: 10,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#AF2030',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconContainer: {
    marginLeft: 10,
  },
});

export default ConfirmRentScreen;
