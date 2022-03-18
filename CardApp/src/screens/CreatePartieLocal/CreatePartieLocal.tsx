import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { RouteParams } from "~/navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {useState, useEffect} from "react"
import {View, ScrollView, Text, StyleSheet, Alert, KeyboardAvoidingView,Image, Platform, TextInput, TouchableOpacity, Keyboard} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PartieLocal } from '~/screens/PartieLocal';
import {Header} from '~/components/Header';
import { ModalPopUp } from "~/components/ModalPopUp"
import * as ScreenOrientation from 'expo-screen-orientation';


export const CreatePartieLocal : React.FunctionComponent<{}> = ({}) => {

  
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();

  // STATE LISTE JOUEURS + TEXT INPUT

  const [playerName, setPlayerName] = useState<string>('');
  const [playersList, setPlayersList] = useState<Array<string>>([]);

  // STATE FENETRES MODALES

  const [showNameWarning, setNameWarning] = useState<boolean>(false);
  const [showNoPlayersWarning, setNoPlayersWarning] = useState<boolean>(false);

  const handleAddPlayer = () =>{
    if(playerName!=''){

      Keyboard.dismiss();
      setPlayersList([...playersList, playerName]);
      setPlayerName('');     
    }
    else{     
      setNameWarning(true);
    } ;  
  };

  // useEffect(()=>{
  //   console.log('updated playersList : \n', playersList);
  // },[playersList])



  const deletePlayer = (index: number) => {

    let playerListCopy = [...playersList];  
    playerListCopy.splice(index,1);
    setPlayersList(playerListCopy);
    
  };

  const onLaunchPress = () => {
    if(playersList.length !=0){

      navigation.navigate("PartieLocal",{
        playerList : playersList ,
      });

    }
    else{
      setNoPlayersWarning(true);
    }
    
  }
  
  return(
    <View style={styles.container}>

      {/* Modal Pop Ups */}

      <ModalPopUp visible={showNameWarning}>
        <View>
          <Text>Veuillez rentrer au moins un caractère.</Text>
        </View>
        <TouchableOpacity style={styles.gotItButton} onPress={()=>{setNameWarning(false);}}>
          <Text>Compris !</Text>
        </TouchableOpacity>
      </ModalPopUp>

      <ModalPopUp visible={showNoPlayersWarning}>
        
        <View>
          <Text>Veuillez inscrire au moins un joueur.</Text>
        </View>
        <TouchableOpacity style={styles.gotItButton} onPress={()=>{setNoPlayersWarning(false);}}>
          <Text>Compris !</Text>
        </TouchableOpacity>
      </ModalPopUp>

      {/* Registered players */}
      <View style={styles.playersWrapper}>

        
        <Header>Nouvelle partie</Header>
        
        <ScrollView style={styles.scroll}>       
          <View style={styles.items}>
            {
              playersList.map((item, index) => {
                return (

                  
                  <View key={index} style={styles.player}>
                    <Text>{item}</Text>
                    <TouchableOpacity  onPress={()=>deletePlayer(index)}>  
                      <Text style={styles.deleteIcon}>Supprimer</Text>               
                    </TouchableOpacity>
                  </View>
                  
                )
              }
              )
            }              
          </View> 
        </ScrollView>
        

      </View>

      {/* Add new player */}
      <KeyboardAvoidingView
        behavior = {Platform.OS === "ios" ? "padding" : "height"}
        style= {styles.bottomWrapper}
      >
        <View style={styles.addPlayerWrapper}>       
          <TextInput style={styles.textInput} placeholder = {"Ajouter un joueur"} onChangeText ={text => setPlayerName(text)} value={playerName}/>

          <TouchableOpacity onPress={handleAddPlayer}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.launchButton} onPress = {()=>onLaunchPress()}>
          <Text>Lancer la partie</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>

    </View>
  )
}




const styles = StyleSheet.create({

  container : {
    flex : 1,
    backgroundColor : "#E8EAED",
  },

  playersWrapper : {
    paddingTop : 20,
    paddingHorizontal : 20,
  },
  scroll : {
    height : '65%'
  },

  title : {
    fontSize:32,
    fontWeight:'bold',  
  },

  items : {
    marginTop :30,
  },
  gotItButton : {
    margin : 10,
    marginTop : 15,
    borderColor:'green',
    backgroundColor:"rgba(90,255,156,0.1)",
    borderWidth:1,
    borderRadius:5,
    padding : 10
  },
  player : {
    flexDirection:'row',
    backgroundColor : "#FFF",
    padding : 15,
    borderRadius : 10,
    alignItems : "center",
    justifyContent : "space-between",
    marginBottom : 20,
  },

  deleteIcon : {
    
    color:'red',
  },

  addPlayerWrapper : {
    
    flexDirection : 'row',
    justifyContent : 'space-between',
    paddingHorizontal : 20,
    alignItems:'center',
  },

  bottomWrapper : {
    position : 'absolute',
    bottom : 60,
    width : '100%',
  },

  textInput : {
    padding : 15,
    backgroundColor : '#FFF',
    borderRadius : 60,
    borderColor : "#C0C0C0",
    borderWidth : 1,
    width : 290,
  },
  addWrapper : {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },

  addText : { },

  launchButton : {
    backgroundColor : "#FFF",
    height : 60,
    marginTop : 20,
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 60,
    borderColor : "#C0C0C0",
    borderWidth : 1,
    marginHorizontal : 20,
  }

  

});
