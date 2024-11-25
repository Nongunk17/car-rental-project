import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

initializeApp(firebaseConfig);

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
  RentalHistory: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style = {styles.titleText}> Log in </Text>
      <View style={styles.group}>
        <Text style={styles.displayText}>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Text style={styles.displayText}>Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={[styles.text]}>
            <Text> Have no account yet? </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Image
        source={require('./assets/car.png')}
        style={styles.banner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 25,
    marginBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    marginTop: -160,
    backgroundColor: '#AF2030'
  },
  group: {
    height: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16
  },
  displayText: {
    marginTop: 10,
    marginLeft: -1,
    marginBottom: 5,
    fontSize: 13,
  },
  input: {
    height: 42,
    width: 329,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: -1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    height: 50,
    width: 329,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AF2030',
    borderRadius: 10,
    marginTop: 30,
    marginLeft: -1,
    marginBottom: 12
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    color: '#AF2030'
  },
  signupText: {
    color: '#AF2030',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginLeft: 7
  },  
  banner: {
    width: 330,
    height: 300,
    marginTop: -10,
    marginBottom: -200,
    alignSelf: 'flex-end', 
    marginRight: -17,     
  },
});

export default LoginScreen;