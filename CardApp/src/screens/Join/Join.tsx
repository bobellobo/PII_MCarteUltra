import { NativeStackNavigatorProps,NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions,TouchableOpacity} from "react-native"
import Button from "~/components/Button";
import TextInput from "~/components/TextInput"
import {firebase} from "~/firebase/config"
import {ModalPopUp} from "~/components/ModalPopUp"
import {colors} from "~/constants/colors"

interface JoinProps {
    navigation : any,
    route : any
}

export const Join  = (props:JoinProps) =>
{   
        // State : player info
        const [gameId, setGameId] = useState<string>('');
        const [playerName, setPlayerName] = useState<string>('');

        // State : Modal Pop-ups.
        const  [invalidGameId,setInvalidGameId] = useState<boolean>(false);
        const [invalidPlayerName, setInvalidPlayerName] = useState<boolean>(false);

        
        var database = firebase.default.database();

        const validGameId = async (id : string) => {
             
            // On vérifie que l'ID n'est pas une chaîne vide.
            if(id==''){
                console.log('GameID must 5 characters long.')
                return false;
            } 
            // On vérifie s'il y a une correspondance en valeur entre id et les champs games de la BDD.    
            var data = await database.ref('games').orderByKey().equalTo(id).once('value')
            
            if(data.val()==null){
                console.log('Game ID is not valid.');
                return false;
            }
            else{
                console.log('Game ID is valid');
                return true;
            }
            // False --> setPopUpModal avec une fenêtre modale pour dire "cet ID n'existe pas etc"
        }

        const onSubmit = async () => {
            
            const isValid = await validGameId(gameId)
            let status;
            await database.ref('games/'+gameId+'/status').once('value').then((snapshot)=>{
                status=snapshot.val();
            })
            if(isValid){
                // Ecriture en BDD
                // Navigation écran Lobby. 

                database.ref('players/'+gameId+'/'+playerName).update({
                    role : 'guest'
                })

                if(playerName==''){
                    console.log('Player name is not valid.');
                    setInvalidPlayerName(true)                
                }
                else{
                    if(status=='lobby'){
                        props.navigation.navigate("Lobby",{
                            id : gameId,
                            playerName : playerName,
                            role : 'guest'
                        })
                    }
                    
                    // Sera développé plus tard pour permettre à un joueur de rejoindre une partie en cours de route.
                    // else{
                    //     props.navigation.navigate("Game",{
                    //         id : gameId,
                    //         playerName : playerName,
                    //         role : 'guest',
                    //     })
                    // }
                }
            }
            else{
                console.log('Game ID is not valid')
                setInvalidGameId(true);
            }

        }

        return(
            <View style={styles.container}>

                {/* Modal Pop-ups */}
                <ModalPopUp visible={invalidPlayerName&&invalidGameId}>
                    <View>
                    <Text>Informations incorrectes</Text>
                    </View>
                    <TouchableOpacity style={styles.gotItButton} onPress={()=>{setInvalidPlayerName(false);
                    setInvalidGameId(false);}}>
                    <Text>OK</Text>
                    </TouchableOpacity>
                </ModalPopUp>

                <ModalPopUp visible={invalidGameId}>
                    <View>
                    <Text>ID non valide</Text>
                    </View>
                    <TouchableOpacity style={styles.gotItButton} onPress={()=>{setInvalidGameId(false);}}>
                    <Text>OK</Text>
                    </TouchableOpacity>
                </ModalPopUp>

                <ModalPopUp visible={invalidPlayerName}>
                    <View>
                        <Text>Pseudo non valide (au moins 1 caractère)</Text>
                    </View>
                    <TouchableOpacity style={styles.gotItButton} onPress={()=>{setInvalidPlayerName(false);}}>
                    <Text>OK</Text>
                    </TouchableOpacity>
                </ModalPopUp>
                
                <View>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%',textAlign:'center'}}>
                        REJOINDRE
                    </Text>
                </View>
                <TextInput placeholder="Game ID" onChangeText={(text:string)=>{setGameId(text)}} value={gameId}> </TextInput>
                <TextInput placeholder="Votre pseudo" onChangeText={(text:string)=>{setPlayerName(text)}} value={playerName}> </TextInput>
                <Button text="REJOINDRE" textStyle={{fontSize : Dimensions.get('screen').width*0.06}}buttonStyle={styles.buttonStyle}onPress={()=>onSubmit()}/>
                
            </View>
        )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor: colors.backGroundColor
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
      buttonStyle : {
        backgroundColor : 'white',
        borderColor : 'black',
        borderWidth : 1,
    },
})