export type RootStackParamList = {
  Home: undefined;
  Signup: undefined;
  Login: undefined;
  ListOfAvailableCars: undefined;
  RentalHistory: undefined;
  ConfirmRent: { carId: string }; 
  CarBooking: { carId: string };
};
