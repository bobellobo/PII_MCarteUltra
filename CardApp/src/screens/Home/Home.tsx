
import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import { RouteParams } from "~/navigation/RootNavigator";
import * as ScreenOrientation from 'expo-screen-orientation'
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {firebase} from "~/firebase/config"
import Button from "~/components/Button"

interface HomeProps {}

export const Home : React.FunctionComponent<HomeProps> = ({}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  const signInTest=()=>{
    firebase.default.auth()
    .signInAnonymously()
    .then(() => {
      console.log('User signed in anonymously');
    })
    .catch(error => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }
  
      console.error(error);
    });
  }


  
  return(
    
    <View style={styles.container}>
      <View style = {{paddingVertical : Dimensions.get('screen').height/4, paddingHorizontal : 20, justifyContent:'center'}}>
        <View style={{alignItems:"center", justifyContent:'center'}}> 
          <Text style={[styles.title,{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}]}>MCarte Ultra</Text>
          <Button text="Nouvelle partie en local" onPress={()=>navigation.navigate("CreatePartieLocal")}/>
          <Button text="Créer une partie" onPress={()=>navigation.navigate("Create")}/>
          <Button text="Rejoindre" onPress={()=>navigation.navigate("Join")}/>
          <Button text="Paramètres" onPress={()=>{}}/>
          <Button text="Sign In Test" onPress={()=>signInTest()}/>
        </View>
      </View>   
    </View>
  )
}

const styles = StyleSheet.create({

  container : {
    flex : 1,
    alignContent:'center',
  },

  title : {
    fontSize:32,
    fontWeight:'500'
  },

  buttonText : {
    fontSize:16
  },

  menuButton : {
    backgroundColor : "#FFF",
    height : 60,
    minWidth:200,
    marginVertical : 20,
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 60,
    borderColor : "#C0C0C0",
    borderWidth : 1,
    marginHorizontal : 20,
  }

});
