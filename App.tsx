import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './Signup';
import LoginScreen from './Login';
import HomeScreen from './Home';
import ListOfAvailableCars from './ListOfAvailableCars';
import RentalHistoryScreen from './RentalHistoryScreen';
import ComfirmRentScreen from './ConfirmRentScreen';
import CarBookingScreen from './CarBookingScreen';

type RootStackParamList = {
  Home: undefined;
  Signup: undefined;
  Login: undefined;
  ListOfAvailableCars: undefined;
  RentalHistory: undefined;
  ConfirmRent: { carId: string }; 
  CarBooking: { carId: string };
};


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ListOfAvailableCars" component={ListOfAvailableCars} />
        <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} />
        <Stack.Screen name="ConfirmRent" component={ComfirmRentScreen} />
        <Stack.Screen name="CarBooking" component={CarBookingScreen} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}