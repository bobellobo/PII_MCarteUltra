import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions, DrawerLayoutAndroidBase} from "react-native"
import {firebase} from "~/firebase/config"

interface LobbyProps {
    navigation:any,
    route:any
}
export const Lobby = (props:LobbyProps) =>
{
        
        let id = props.route.params?.id as string; // gameId
        let playerName = props.route.params?.playerName as string; // pseudo
        const [playerRole,setPlayerRole] = useState<string>('');
        const [playersList,setPlayersList] = useState<object>({});
        
        let database = firebase.default.database();

        useEffect(()=>{
            // componentDidMount
            console.clear();
            console.log('Lobby did mount, Game ID : ',id)

            // Fetch liste players
            getPlayerRole()
            setPlayersList(fetchPlayers());

            // Instancier la BDD.
            return () => {
              // componentWillUnmount
              console.log('Lobby will unmount.')
              // Reset playerName éventuellement.
            };
          },[]);

          const getPlayerRole = async ()=>{
              let data = await database.ref('players/'+id+'/'+playerName).once('value');
              let role = data.child('role').val()
              console.log('role : ', role)
              setPlayerRole(role);
          }

          const fetchPlayers = async ()=> {
              let data = await database.ref('players/').orderByKey().once('value');
              let list = data.child(id).val()
              console.log('liste joueurs : ',  list)
              return list
          }


        
        
        
        return(
            <View style={styles.container}>
                
                <View>
                    <Text style={{fontSize:Dimensions.get('window').height/20, fontWeight:'bold',marginBottom:'5%'}}>
                        Lobby
                    </Text>
                    <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'200',marginBottom:'5%'}}>
                        Game ID : {id}
                    </Text>
                    <Text style={{fontSize:Dimensions.get('window').height/25, fontWeight:'200',marginBottom:'5%'}}>
                        playerName : {playerName}
                    </Text>
                    
                </View>               
                
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