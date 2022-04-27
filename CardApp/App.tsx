import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import {NavigationContainer} from "@react-navigation/native";
import { Home } from '~/screens/Home';
import { PartieLocal } from '~/screens/PartieLocal';
import { RootNavigator } from '~/navigation/RootNavigator';
import { useFonts } from '@use-expo/font';
import  AppLoading  from 'expo';

export default function App() {

  let [fontsLoaded] = useFonts({
    'Sirukota': require('./src/ressources/fonts/Sirukota.ttf')
   });
   
   if(!fontsLoaded){
     return(
       <View><Text>BUAH</Text></View>
     )
   }
   else{
    return (   
      <NavigationContainer>
        <RootNavigator/>
        <StatusBar style="auto" hidden={true}/>
      </NavigationContainer>
  
    );
   }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
