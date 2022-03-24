import React,{Component,useEffect,useState} from "react";
import {StyleSheet,View,Text, Dimensions, Keyboard} from "react-native"
import Button from "~/components/Button";
import TextInput from "~/components/TextInput"
import { StackNavigationState, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteParams } from "~/navigation/RootNavigator";
import { Join } from "..";
import {firebase} from "~/firebase/config"
import rand from 'random-seed';

interface CreateProps {
}

export const Create : React.FunctionComponent<CreateProps> = ({}) =>
{
    
    const [playerName,setPlayerName] = useState<string>('')
    const [navigation, setNavigation] = useState<NativeStackNavigationProp<RouteParams>>()
    const [gameId,setGameId] = useState<string>('');

    var database = firebase.default.database();
    
    useEffect(()=>{
        // componentDidMount
        console.log('Create did mount')
        setNavigation(useNavigation<NativeStackNavigationProp<RouteParams>>());       
        // Instancier la BDD.
        return () => {
          // componentWillUnmount
          console.log('Create will unmount.')
          // Reset playerName éventuellement.
        };
      },[]);

    useEffect(()=> {
        // CODE HERE
        //console.log(playerName) 
      },[playerName]);

      const onSubmit = () => {

        Keyboard.dismiss();
        createGame();
        setPlayerName('');
        // navigation?.navigate('Lobby',{
        //   gameId : gameId
        // })
                
      }

      const createGame = () => {       
          let gameId = createGameID();
          setGameId(gameId);
          // Checker la s'il n'y a pas déjà une partie avec le même ID dans la BDD. while()do{}
          console.log("Game ID : ",gameId);

          // Instancier une nouvelle table dans la BDD.
          database.ref('games/'+gameId).set({
            host : playerName,
            status : 'waitingForPlayers'
          })
          database.ref('players/'+gameId).set({
            name : playerName,
            role : 'host'
          })
          // Games --> id --> états relatifs à la partie
          // Players --> node id --> playerName : {statut : host}
          // Decks --> node id --> Deck
      }

      const createGameID = () => {
        let id = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let length = 5;
        let seed = Date.now().toString();
        let seededRandom = rand.create(seed); 
        for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(seededRandom(characters.length)));
        }
        return id;       
      }

    

        return(
            <View style={styles.container}>
                
                <View>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}}>
                        Créer une partie
                    </Text>
                </View>
                <TextInput placeholder="Votre pseudo" onChangeText={(text : string )=>setPlayerName(text)} value={playerName}> </TextInput>
                <Button text="Créer" onPress={()=>onSubmit()}/>
                
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