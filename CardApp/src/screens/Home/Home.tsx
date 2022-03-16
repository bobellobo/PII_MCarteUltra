import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { RouteParams } from "~/navigation/RootNavigator";
import * as ScreenOrientation from 'expo-screen-orientation'


interface HomeProps {}

export const Home : React.FunctionComponent<HomeProps> = ({}) => {

  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();

  const newGamePressed = () => {
    navigation.navigate("CreatePartie");
  };
  
  return(
    
    <View style={styles.container}>

    <View style = {{marginTop:20, paddingVertical : 90, paddingHorizontal : 20, justifyContent:'center'}}>

      <View style={{alignItems:"center", justifyContent:'center',marginBottom:20,}}> 
        <Text style={[styles.title,{marginBottom:20}]}>MCarte Ultra</Text>
      

        <TouchableOpacity style={styles.menuButton} onPress={()=>newGamePressed()}>
          <Text style={styles.buttonText}>Nouvelle partie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.buttonText}>En ligne</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.buttonText}>Paramètres</Text>
        </TouchableOpacity>

      </View>
    </View>
    

    </View>
  )
}

const styles = StyleSheet.create({

  container : {
    flex : 1,
    alignContent:'center',
    paddingTop : 50,
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
