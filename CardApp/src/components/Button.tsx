import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

interface ButtonProps {
    text: string,
    onPress: Function
    disabled? : boolean, // Activé par défaut
    textStyle? : object,
    buttonStyle? : object
}


export default class Button extends React.Component<ButtonProps,{}>{
    
    isDisabled = !(this.props.disabled === undefined || this.props.disabled === false)

    render(){
        return(
        <TouchableOpacity
        style={[styles.button,this.props.buttonStyle]}
        onPress={this.isDisabled ? ()=>{} : ()=>this.props.onPress()}
        >
            <Text style={this.props.textStyle}>
                {this.props.text}
            </Text>
        </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
      minWidth: '85%',
      maxWidth: '85%',
      backgroundColor: '#ffffff',
      borderRadius: Dimensions.get('window').height/2,
      margin: 10,
      height: Dimensions.get('window').height/13,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
})
