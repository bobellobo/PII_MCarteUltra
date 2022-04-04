import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions,ScrollView} from "react-native"
import {firebase} from "~/firebase/config"
import Button from "~/components/Button";
import {colors} from "~/constants/colors"
import { ModalPopUp } from "~/components/ModalPopUp";
import { chunk } from "lodash";
import useForceUpdate from 'use-force-update'

interface LobbyProps {
    navigation:any,
    route:any
}
export const Lobby = (props:LobbyProps) =>
{
        
        let gameId = props.route.params?.id as string; // gameId
        let playerName = props.route.params?.playerName as string; // pseudo
        const [playerRole,setPlayerRole] = useState<string>('');
        const [playersList,setPlayersList] = useState<Array<any>>([]);
        const [leaveGameVisible, setLeaveGame] = useState<boolean>(false);
        

        
        let database = firebase.default.database();

        useEffect(()=>{

            console.log(playersList) // Pour "forcer" l'update de playersList
        },[playersList])

        useEffect(()=>{

            // componentDidMount
            playerAdded();
            fetchPlayers();
            getPlayerRole();

            // Instancier la BDD.
            return () => {
              // componentWillUnmount
            };
          },[]);

         
          // Récupère le rôle du joueur
          const getPlayerRole = async ()=>{

              let data = await database.ref('players/'+gameId+'/'+playerName).once('value');
              let role =  data.child('role').val();              
              setPlayerRole(role);
          }

          // Fetch la liste de joueur depuis firebase et remplit playersList
          // Fetch once --> != playerAdded()   
          const fetchPlayers = async () => {
            let list : Array<any> = []
            let data = await database.ref('players/' + gameId).orderByKey();
            (await data.once('value')).forEach(
                (snapshot)=>{
                    let pseudo = snapshot.key;
                    let role = snapshot.child('role').val();
                    console.log('Pseudo : ',pseudo,', role : ',role);
                    list = [...list,[pseudo,role]]
                }
            )
            setPlayersList(list);
        }
          
          // Méthode render pour afficher une flatlist depuis playersList
          const renderPlayersList = () =>
          {
              if(playersList.length!=0)
              {
                

                return playersList.map((item,index)=>{ 
                    return(
                        <View key={index} style = {styles.player}>
                            <Text>{item[0]} {(item[0]==playerName) ? '(you)': ''} <Text style={{fontStyle:'italic'}}>{item[1]}</Text></Text>
                        </View>
                    )
                })
              }
              else{
                  return(
                      <View>
                          <Text>
                              Waiting for players...
                          </Text>
                      </View>
                  )
              }
          }

          // Gère le cas où un joueur quitte la partie.
          const leaveGame = () =>{
            // Voulez vous vraiment quitter ?
            
            // wasHost()

          }

          // "Listen" la BDD pour voir si un joueur s'ajoute et update le render / playerList
          const playerAdded = () =>{
            database.ref('players/'+gameId).on('value',(snapshot)=>{
                
                let list : Array<any> = [];
                snapshot.forEach((childSnapshot)=>{
                    console.log('snapshot.key : ', snapshot.key);
                    console.log('child.key',childSnapshot.key);
                    let pseudo = snapshot.key;
                    let role = childSnapshot.key;
                    list = [...list,[pseudo,role]];
                })
                setPlayersList(list)
            })
          }
        return(

            <View style={styles.container}>
                
                <ModalPopUp visible={leaveGameVisible}>
                    <View>
                        <Text>
                            VOULEZ VOUS VRAIMENT QUITTER ?
                        </Text>
                        <Button buttonStyle={{backGroundColor : 'red'}}text="Oui" onPress={()=>setLeaveGame(false)}></Button> 
                        <Button text="Non" onPress={()=>{setLeaveGame(false)}}></Button>
                    </View>
                </ModalPopUp>

                <View style={{marginTop:Dimensions.get('screen').height/5}}>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}}>
                        Lobby
                    </Text>
                    <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'200',marginBottom:'5%'}}>
                        Game ID : {gameId}
                    </Text>
                    <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'200',marginBottom:'5%'}}>
                        playerName : {playerName}
                    </Text>
                </View>
                <ScrollView>
                 {renderPlayersList()}
                </ScrollView>       
                <Button text="QUITTER" onPress={()=>setLeaveGame(true)}></Button>
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
    player : {
        flexDirection:'row',
        backgroundColor : "#FFF",
        padding : 15,
        borderRadius : 10,
        alignItems : "center",
        justifyContent : "space-between",
        marginBottom : 20,
        minWidth:Dimensions.get('screen').width/2
    },
})