import React,{Component} from "react";
import {StyleSheet,View,Text} from "react-native"

export default class Create extends Component<{},{}>
{
    state={

    }

    render() {

        return(
            <View style={styles.container}>
                <Text>
                    Create Game Screen
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