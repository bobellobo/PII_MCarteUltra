import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions} from "react-native"
import Button from "~/components/Button";
import TextInput from "~/components/TextInput"

interface JoinProps {
    navigation : any,
    route : any
}
export const Join  = (props:JoinProps) =>
{   
        const [gameId, setGameId] = useState<string>('');
        const [playerName, setPlayerName] = useState<string>('');

        useEffect(()=>{
            console.log('Player Name : ',playerName)
        },[playerName])

        useEffect(()=>{
            console.log('Game ID : ',gameId)
        },[gameId])
        return(
            <View style={styles.container}>
                
                <View>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}}>
                        Rejoindre une partie
                    </Text>
                </View>
                <TextInput placeholder="Game ID" onChangeText={(text:string)=>{setGameId(text)}} value={gameId}> </TextInput>
                <TextInput placeholder="Votre pseudo" onChangeText={(text:string)=>{setPlayerName(text)}} value={playerName}> </TextInput>
                <Button text="Rejoindre" onPress={()=>{}}/>
                
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