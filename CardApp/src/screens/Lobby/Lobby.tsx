import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions} from "react-native"
import {useRoute, useNavigation, RouteProp, } from "@react-navigation/native"
import {RouteParams} from "~/navigation/RootNavigator"
import { NavigationStackProp } from "react-navigation-stack";

interface LobbyProps {
    navigation:any,
    route:any
}
export const Lobby = (props:LobbyProps) =>
{
        
        let id = props.route.params?.id as string;
        let playerName = props.route.params?.playerName as string; 

        useEffect(()=>{
            // componentDidMount
            console.log('Lobby did mount',id)
            // Instancier la BDD.
            return () => {
              // componentWillUnmount
              console.log('Lobby will unmount.')
              // Reset playerName éventuellement.
            };
          },[]);


        
        
        
        return(
            <View style={styles.container}>
                
                <View>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}}>
                        Lobby
                    </Text>
                    <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'200',marginBottom:'5%'}}>
                        Game ID : {id}
                    </Text>
                    <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'200',marginBottom:'5%'}}>
                        playerName : {playerName}
                    </Text>
                    
                </View>               
                
            </View>
        )
    
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
      },
})