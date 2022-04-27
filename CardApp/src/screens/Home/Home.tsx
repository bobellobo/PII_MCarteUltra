
import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import { RouteParams } from "~/navigation/RootNavigator";
import * as ScreenOrientation from 'expo-screen-orientation'
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {firebase} from "~/firebase/config"
import Button from "~/components/Button"
import {colors} from "~/constants/colors"

interface HomeProps {}

let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;

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
        <View style={{alignItems:"center", justifyContent:'center',paddingVertical : Dimensions.get('screen').height/4, paddingHorizontal : 20,}}> 
          <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'bold',marginBottom:'5%'}}>MCARTE ULTRA</Text>
          <Button textStyle={styles.buttonText} text="MODE LOCAL" onPress={()=>navigation.navigate("CreatePartieLocal")}/>
          <Button textStyle={styles.buttonText} text="CREER" onPress={()=>navigation.navigate("Create")}/>
          <Button textStyle={styles.buttonText} text="REJOINDRE" onPress={()=>navigation.navigate("Join")}/>
          {/* <Button text="Paramètres" onPress={()=>{}}/>
          <Button text="Sign In Test" onPress={()=>signInTest()}/> */}
        </View> 
    </View>
  )
}

const styles = StyleSheet.create({

  container : {
    flex : 1,
    alignContent:'center',
    backgroundColor: colors.backGroundColor
  },
  buttonText : {
    fontSize: height*0.03,
  },
});
