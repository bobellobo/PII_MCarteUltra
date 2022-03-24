import React,{Component,useState} from "react";
import {StyleSheet,View,Text,Dimensions} from "react-native"
import {useRoute, useNavigation, RouteProp, NavigationContainer} from "@react-navigation/native"
import {RouteParams} from "~/navigation/RootNavigator"

export const Lobby: React.FunctionComponent<{}> = ({}) =>
{
    
        const route = useRoute<RouteProp<RouteParams>>();
        return(
            <View style={styles.container}>
                
                <View>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}}>
                        Lobby
                    </Text>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'200',marginBottom:'5%'}}>
                        Game ID : 
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