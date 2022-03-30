import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions,ScrollView} from "react-native"
import {firebase} from "~/firebase/config"

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
        

        
        let database = firebase.default.database();

        useEffect(()=>{

            console.log(playersList) // Pour "forcer" l'update de playersList
        },[playersList])
        useEffect(()=>{

            // componentDidMount
            fetchPlayers();
            getPlayerRole()

            // Instancier la BDD.
            return () => {
              // componentWillUnmount
            };
          },[]);

         

          const getPlayerRole = async ()=>{

              let data = await database.ref('players/'+gameId+'/'+playerName).once('value');
              let role =  data.child('role').val();              
              setPlayerRole(role);
          }

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
          
          const renderPlayersList = () =>
          {
              if(playersList.length!=0)
              {
                let you = playersList.indexOf([playerName,playerRole]);
                return playersList.map((item,index)=>{ 
                    return(
                        <View key={index} style = {styles.player}>
                            <Text>{item[0]} {(you==index) ? '(You)': ''} <span style={{fontStyle:'italic'}}>{item[1]}</span></Text>
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
        return(
            <View style={styles.container}>
                
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