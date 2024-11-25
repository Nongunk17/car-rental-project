import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './FirebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import {SelectList} from 'react-native-dropdown-select-list';


initializeApp(firebaseConfig);

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

function SignupScreen({ navigation }: Props) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = useState('+66');
  const [phoneNumber, setPhoneNumber] = useState('');

  const data = [
    {key: '+1',value: '+1'},
    {key: '+44',value: '+44'},
    {key: '+61',value: '+61'},
    {key: '+66',value: '+66'}
  ]

  const handleSignup = async () => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style = {styles.titleText}> Sign up </Text>
      <View style={styles.group}>
        <Text style={styles.displayText}>Full name</Text>
        <TextInput
          placeholder="Fullname"
          value={fullname}
          onChangeText={setFullname}
          style={styles.input}
        />
        <Text style={styles.displayText}>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Text style={styles.displayText}>Phone Number</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.dropdownContainer, { flex: 2 }]}>
            <SelectList
              data={data}
              setSelected={setSelected}
              placeholder="+66" 
              boxStyles={styles.dropdown}
            />
          </View>
          <TextInput
            style={[styles.phoneNumber, { flex: 5 }]}
            placeholder="Phone Number"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <Text style={styles.displayText}>Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={[styles.text]}>
            <Text> Already have an account? </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: -30,
    marginBottom: 40,
  },  
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#AF2030'
  },
  group: {
    height: 535,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16
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
  dropdownContainer: {
    flex: 2,
    borderColor: 'gray',
    borderRadius: 5,
    marginLeft: -1,
    marginRight: 10,
    marginTop: -15
  },
  phoneNumber: {
    flex: 5,
    height:42,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 1,
    marginBottom: 15,
  },
  displayText: {
    marginTop: 10,
    marginLeft: -1,
    marginBottom: 5,
    fontSize: 13,
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 15
  },
  dropdownList: {
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
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
  loginText: {
    color: '#AF2030',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginLeft: 7
  },  
});

export default SignupScreen;

