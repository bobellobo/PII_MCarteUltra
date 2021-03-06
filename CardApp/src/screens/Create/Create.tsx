import React,{Component,useEffect,useState} from "react";
import {StyleSheet,View,Text, Dimensions, Keyboard} from "react-native"
import Button from "~/components/Button";
import TextInput from "~/components/TextInput"
import { StackNavigationState, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteParams } from "~/navigation/RootNavigator";
import { Join,Lobby } from "..";
import {firebase} from "~/firebase/config"
import rand from 'random-seed';
import { NavigationStackProp } from "react-navigation-stack";
import {colors} from "~/constants/colors"


export const Create  = (props:{navigation:any,route:any}) =>
{
    
    const [playerName,setPlayerName] = useState<string>('')
    const [gameId,setGameId] = useState<string>('default');
    
    let database = firebase.default.database();
    
    useEffect(()=>{
        // componentDidMount
        console.log('Create did mount') 
        return () => {
          // componentWillUnmount
          console.log('Create will unmount.')
          // Reset playerName éventuellement.
        };
      },[]);


      // Gère l'appui sur le bouton 'CREER'
      const onSubmit = () => {

        if(playerName!=''){
          // Rétracte le clavier
          Keyboard.dismiss();

          // Création d'un identifiant pour la partie.      
          let _id = createGameID();
          // Ecriture dans la BDD
          createGameDB(_id);
          // On amène l'utilisateur à l'écran Lobby
          props.navigation.navigate("Lobby",{
            id : _id,
            playerName : playerName,
            role : 'host'
          })
          setPlayerName('');
        }
      }

      const createGameDB = async (id:string) => {

          // Checker s'il n'y a pas déjà une partie avec le même ID dans la BDD. while()do{}
          // Instancier une nouvelle table dans la BDD.
          await database.ref('games/'+id).set({
            host : playerName,
            status : 'lobby'
          })
          await database.ref('players/'+id+'/'+playerName).set({
            role : 'host'
          })
          // Games --> id --> états relatifs à la partie
          // Players --> node id --> playerName : {statut : host}
          // Decks --> node id --> Deck
      }

      // Création d'un identifiant de 5 lettres random.
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
                  <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'bold',marginBottom:'5%'}}>
                      CREER UNE PARTIE
                  </Text>
              </View>
              <TextInput placeholder="Votre pseudo" onChangeText={(text : string )=>setPlayerName(text)} value={playerName}> </TextInput>
              <Button text="CREER" textStyle={{fontSize : Dimensions.get('screen').width*0.06}} buttonStyle={styles.buttonStyle} onPress={()=>onSubmit()}/>
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
      buttonStyle : {
        backgroundColor : 'white',
        borderColor : 'black',
        borderWidth : 1,
    },
})