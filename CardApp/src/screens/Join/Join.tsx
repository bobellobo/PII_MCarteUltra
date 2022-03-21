import React,{Component} from "react";
import {StyleSheet,View,Text} from "react-native"

export default class Join extends Component<{},{}>
{
    state={

    }

    render() {

        return(
            <View style={styles.container}>
                <Text>
                    Join Game Screen
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
      },
})