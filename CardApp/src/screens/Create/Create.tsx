import React,{Component} from "react";
import {StyleSheet,View,Text, Dimensions} from "react-native"
import Button from "~/components/Button";
import TextInput from "~/components/TextInput"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteParams } from "~/navigation/RootNavigator";
import { Join } from "..";

//const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
export default class Create extends Component<{},{}>
{
    state={
        //playerName :'',
    }
    
    componentDidMount= () => {
        console.log("Create mounted.")
    }

    

    render() {

        return(
            <View style={styles.container}>
                <View>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}}>
                        Créer une partie
                    </Text>
                </View>
                <TextInput placeholder="Votre pseudo" onChangeText={(text : string )=>{this.setState({playerName:text})}} value={this.state.playerName}> </TextInput>
                <Button text="Créer" onPress={()=>{}}/>
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