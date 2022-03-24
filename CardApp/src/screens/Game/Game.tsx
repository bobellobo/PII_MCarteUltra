import React,{Component} from "react";
import {StyleSheet,View,Text} from "react-native"

export const Game: React.FunctionComponent<{}> = ({}) =>
{
    

   

        return(
            <View style={styles.container}>
                <Text>
                    Game Screen
                </Text>
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