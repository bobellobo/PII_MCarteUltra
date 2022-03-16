import React from "react"
import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteParams } from "~/navigation/RootNavigator";
import * as ScreenOrientation from 'expo-screen-orientation';
import {BackHomeButton} from "~/components/BackHomeButton";

interface HeaderProps {
    children : string;
}
export const Header : React.FunctionComponent<HeaderProps> = ({children}) => {
    
    

    return(
    <View style={styles.headerWrapper}>
          <Text style={styles.title}>{children}</Text>
          <BackHomeButton></BackHomeButton>
        </View>
  )
}

const styles = StyleSheet.create({
    headerWrapper:{
        flexDirection : 'row',
        alignItems:'baseline',
        justifyContent : 'space-between',
        marginTop : 50,
        paddingHorizontal :20,
        width :'100%'
      },

      title : {
        fontSize:32,
        fontWeight:'bold',  
      },
})






