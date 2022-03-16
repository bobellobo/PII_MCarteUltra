import React from "react"
import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteParams } from "~/navigation/RootNavigator";
import * as ScreenOrientation from 'expo-screen-orientation';



export const BackHomeButton : React.FunctionComponent<{}> = ({}) => {
    
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
    const goBackPressed = () => {
        navigation.navigate("Home");
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }

    return(
    
        <TouchableOpacity onPress={()=>goBackPressed()}>
        <Image 
        source={require('~/ressources/icons/remove.png')}
        resizeMode='contain'
        style = {{
            width:40,
            height : 40,
            tintColor : 'red',
            opacity:0.5,             
        }}
        />
        </TouchableOpacity>
        
  )
}