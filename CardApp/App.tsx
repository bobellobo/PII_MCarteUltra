import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import {NavigationContainer} from "@react-navigation/native";
import { Home } from '~/screens/Home';
import { PartieLocal } from '~/screens/PartieLocal';
import { RootNavigator } from '~/navigation/RootNavigator';


export default function App() {
  return (   
    <NavigationContainer>
      <RootNavigator/>
      <StatusBar style="auto" hidden={true}/>
    </NavigationContainer>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
