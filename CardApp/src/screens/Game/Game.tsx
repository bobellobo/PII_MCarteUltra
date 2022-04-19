import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions} from "react-native"
import {colors} from "~/constants/colors";
import {firebase} from "~/firebase/config"
import * as ScreenOrientation from 'expo-screen-orientation'
import Deck, { Card } from "~/ressources/cardGame"
import { requireCard } from "~/ressources/imagesPaths"

interface GameProps {
    navigation:any,
    route:any
}

let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;

export const Game = (props:GameProps) =>
{
    const gameId = props.route.params?.gameId;
    const playerName = props.route.params?.playerName; 
    const [playersList,setPlayersList] = useState<Array<any>>([]); 
    let [playerRole,setPlayerRole] = useState<string>(props.route.params?.playerRole); 
    const [message, setMessage] = useState<string>('Waiting for game to start..');
    let deck : Deck;
    let database = firebase.default.database();

    useEffect(()=>{
        // componentDidMount
        console.log('Game did mount.')
        if(playerRole=='host'){
            console.log('Setting up deck card..')
            setUp();
            console.log('Game started.');
            
        }
        else{
            do{
                console.log('Waiting for game to start...');
            }
            while(!listenForSetUp())
            console.log('Game started.')
        }
        getPlayerList()
        setMessage('Game started')
        return () => {
            console.log('Game will unmount.')
        };
      },
      []);

      const setUp = async ()=>{
        // Création d'un nouveau deck de cartes
        deck = new Deck();
        // On mélange le deck.
        deck.shuffle();
        console.log('Deck : ',deck)
        await database.ref('games/'+gameId+'/').set({
            deck
        })
        database.ref('games/'+gameId+'/').update({
            status : 'started'
        })
      }

      // Return true if set up is achieved correctly on the host device, else false.
      const listenForSetUp = async () => {
          database.ref('games/'+gameId+'/status/').on('value',(snapshot)=>{
            let status = snapshot.val();
            if(status=='started'){
                return true
            }
            else return false
          })
      }

      const getPlayerList = async () => {
        let list : Array<any> = []
        let data = await database.ref('players/' + gameId).orderByKey();
        (await data.once('value')).forEach(
            (snapshot)=>{
                let pseudo = snapshot.key;
                let role = snapshot.child('role').val();
                list = [...list,[pseudo,role]]
            }
        )
        setPlayersList(list);
    }
    
    return(
            <View style={styles.container}>
                <Text style={styles.title}>
                    Game Screen <br /> <br /> 
                    ID : {gameId} <br />
                    Player Name : {playerName} <br />
                    Role : {playerRole}
                </Text>
                <Text style={styles.title}>{message}</Text>
                <Text>{playersList}</Text>
            </View>
        )
    
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor:colors.backGroundColor
      },
      title:{
        fontSize:height/22.5, 
        fontWeight:'bold',
        marginBottom:'5%',
        textAlign:'center'
    },
})