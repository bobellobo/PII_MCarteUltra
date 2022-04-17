import React, {Component} from 'react';
import { StyleSheet, TextInput, Text, Dimensions } from 'react-native';

interface TextInputProps {
    placeholder : string,
    inputStyle? : object,
    onSubmit? : Function,
    onChangeText : Function,
    value : string,
}


export default class Button extends React.Component<TextInputProps,{}>{

    render(){
        return(
        <TextInput
        style={[styles.textInput,this.props.inputStyle]}
        onChangeText={(text : string)=>this.props.onChangeText(text)}
        value={this.props.value}
        placeholder={this.props.placeholder}
        >
        </TextInput>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        paddingLeft: Dimensions.get('window').width/15,
        paddingRight: Dimensions.get('window').width/15,
        minWidth: '85%',
        maxWidth: '85%',
        marginVertical : '5%',
        color: "black",
        backgroundColor: '#ffffff',
        borderRadius: Dimensions.get('window').height,
        height: Dimensions.get('window').height/12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: Dimensions.get('window').height/50,
        textAlign: 'center'
    },
})
