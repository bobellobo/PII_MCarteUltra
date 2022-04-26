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

// Pour ajuster la taille des élément en fonction de la taille de l'écran.
let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;

export const Lobby = (props:LobbyProps) =>
{
        // STATE ET VARIABLES
        let gameId = props.route.params?.id as string; // Identifiant de la partie passé en props via la navigation
        let playerName = props.route.params?.playerName as string; // Pseudo du joueur passé en props via la navigation

        const [playerRole,setPlayerRole] = useState<string>(props.route.params?.role as string); // Host ou guest
        const [playersList,setPlayersList] = useState<Array<any>>([]); // Liste des joueurs [pseudo, role]
        const [leaveGameVisible, setLeaveGame] = useState<boolean>(false); // Booléen d'activation du composant ModalPopUp
        
        let database = firebase.default.database();

        useEffect(()=>{
            if(playersList.length != 0) console.log(playersList)
        },[playersList,playerRole])

        useEffect(()=>{

            // componentDidMount
            // On fait appel au fonction qui 'écoutent' la BDD.
            playerAdded();
            fetchPlayers();
            changeRole();
            hostDidLaunch();

            return () => {
              // componentWillUnmount
              console.log('Lobby screen will unmount..')
              leaveGame();
              database.ref().off();
            };
          },[]);

        // Fetch la liste de joueur depuis firebase et remplit playersList
        // Fetch once --> != playerAdded()   
        const fetchPlayers = async () => {
            let list : Array<any> = []
            let data = await database.ref('players/' + gameId).orderByKey();
            (await data.once('value')).forEach(
                (snapshot)=>{
                    let pseudo = snapshot.key;
                    let role = snapshot.child('role').val();
                    list = [...list,[pseudo,role]]
                }
            )
            setPlayersList(list); // Modification du state.
        }

    // "Listen" la BDD pour voir si un joueur s'ajoute et update le render / playerList
    const playerAdded = () =>{
    database.ref('players/'+gameId).on('value',(snapshot)=>{
        let list : Array<any> = [];
        snapshot.forEach((childSnapshot)=>{
            let pseudo = childSnapshot.key;
            let role = childSnapshot.child('role').val();
            list = [...list,[pseudo,role]];
        })
        setPlayersList(list)
    })}

    // Mise à jour du state si le rôle du joueur est modifié. (si l'hôte quitte la partie par exemple)
    const changeRole = () => {
        database.ref('games/'+gameId).on('value',(snapshot)=>{
            let host = snapshot.child('host').val();
            if(host==playerName){
                setPlayerRole('host');
            }
        })
    }

    // Gère le cas où un joueur quitte la partie.
    const leaveGame = async () =>{

        console.log('Leaving the game..')
        // On vérifie si le joueur était le dernier connecté pour supprimer les données relatives à la partie dans la BDD après son départ.
        console.log('Checking if player was the last one to leave the game...')

        if(await wasLastPlayer()){
            console.log(playerName, 'was the last player to leave the game.')
            database.ref('games/'+gameId).remove()
            .then(()=>{console.log('Game removed succesfully')})
            .catch((error)=>{console.log('Error : ', error)})
            database.ref('players/'+gameId).remove()
            .then(()=>{console.log('Players removed succesfully')})
            .catch((error)=>{console.log('Error : ', error)})
        }
        else{
            console.log(playerName, 'was not the last player. Checking if ',playerName,' was host...')
            // On vérifie s'il était hôte pour réattribuer le rôle d'hôte.
            console.log('Checking if player was host..')   
            console.log('Résultat wasHost() : ',await (await wasHost()).valueOf())
            if(await wasHost()){
                console.log(playerName, 'was host, setting new host for the game.');
                // Look for another player pseudo/id
                let newHostPseudo = playerName
                let newPlayer=[];
                let i =0;
                do{
                    newPlayer = playersList[i];
                    newHostPseudo = newPlayer[0]
                    i+=1;
                }
                while(newHostPseudo==playerName)
                // Mise à jour hôte.
                database.ref('games/'+gameId).update({
                    host : newHostPseudo
                })
            }
            else{
                console.log(playerName, 'was not host.')
            }
            database.ref('players/'+gameId+'/'+playerName).remove()
            .then(()=>{console.log('Player ',playerName,' removed succesfully')})
            .catch((error)=>{console.log('Error : ', error)})
        }   
        setLeaveGame(false);
        props.navigation.navigate("Home");
    }

    // Détermine si le joueur est le dernier connecté à la partie.
    const wasLastPlayer = async () => {
        let id = gameId;
        let data = await database.ref('players/'+id).once('value');
        let numberOfPlayers = data.numChildren();
        if(numberOfPlayers===1)
        {return true}
        else{return false}
    }

    // Vérifie si le joueur est l'hôte de la partie.
    const wasHost = async () => {
    let data = await database.ref('players/'+gameId+'/'+playerName).once('value');
    let role =  data.child('role').val();
    if(role=='host'){ return true}
    else{ return false }
    }
    
    // Si le rôle du joueur est hôte, il a accès à un bouton qui lance la partie.
    // On modifie le champ 'status' de la BDD sur 'launching' pour que l'information soit récupérée par les autres utilisateurs et naviguer vers l'écran GAME.
    const launchGame = () => {
        if(playersList.length!=1){
            database.ref('games/'+gameId+'/').update({
                status : 'launching'
            })
        } 
    }


    // Détecte un changement du statut de la partie au niveau firebaseDatabase/games/gameID/status et navigue vers l'écran d'accueil
    const hostDidLaunch = () => {
        database.ref('games/'+gameId).on('value',(snapshot)=>{
            let status = snapshot.child('status').val();
            if(status=='launching'){
                database.ref('games/'+gameId).off()
                database.ref('players/'+gameId).off()
                props.navigation.navigate('Game',{
                    gameId : gameId,
                    playerName : playerName,
                    playerRole : playerRole,
                });
            }
        })
    }

    // Méthode render pour afficher une flatlist depuis playersList
    const renderPlayersList = () =>
    {
        if(playersList.length!=0)
        {
        return playersList.map((item,index)=>{ 
            return(
                <View key={index} style = {styles.playerWrapper}>
                    <Text style={styles.playerText}>{item[0]} {(item[0]==playerName) ? '(vous)': ''} <Text style={{fontStyle:'italic'}}>{item[1]}</Text></Text>
                </View>
            )
        })
        }
        else{
            return(
                <View style={styles.waiting}> 
                    <Text style={{fontSize:height*0.04, textAlign:'justify',fontWeight:'600'}}>
                        En attente de joueurs...
                    </Text>
                </View>
            )
        }
    }

        return(
            <View style={styles.container}>

                {/* Pop-up pour quitter la partie */}
                <ModalPopUp visible={leaveGameVisible}>
                    <View>
                        <Text style={styles.modalText}>
                            QUITTER LA PARTIE ?
                        </Text>
                        <Button buttonStyle={styles.buttonStyle} text="Oui" onPress={leaveGame}></Button> 
                        <Button buttonStyle={styles.buttonStyle} text="Non" onPress={()=>{setLeaveGame(false)}}></Button>
                    </View>
                </ModalPopUp>
                
                <View style={styles.topWrapper}>
                    <Text style={styles.title}>
                        LOBBY
                    </Text>
                    <Text style={styles.gameIdTextCell}>
                        Game ID : {gameId}
                    </Text>
                </View>
                <ScrollView style={styles.listWrapper}>
                 {renderPlayersList()}
                </ScrollView>

                {playerRole=='host'? <Button text="LANCER" buttonStyle={styles.buttonStyle} onPress={launchGame}/> : null}
                   
                <Button text="QUITTER" buttonStyle={styles.buttonStyle} onPress={()=>setLeaveGame(true)}/>  
            </View>
        )    
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent :'space-around',
        display: 'flex',
        backgroundColor: colors.backGroundColor
    },
    title:{
        fontSize:Dimensions.get('window').height/17, 
        fontWeight:'bold',
        marginBottom:'5%'
    },
    playerWrapper : {
        flexDirection:'row',
        backgroundColor : "#FFF",
        padding : height*0.01,
        borderRadius : height*0.04,
        alignItems : "center",
        justifyContent : "center",
        marginBottom : height*0.02,
        minWidth: width*0.8
    },
    playerText : {
        fontSize : height*0.035,
    },
    topWrapper : {
        marginTop: height*0.03,
        marginBottom : height*0.03,
        maxHeight : '25%',
        alignItems:'center',
        flex : 1,
    },
    gameIdTextCell : {
        fontSize: height/25, 
        fontWeight:'200',
        minWidth : width/1.15,
        textAlign:'center',
        justifyContent : 'center',
        alignItems:'center',
        borderWidth : 2,
        backgroundColor : '#fff',
        borderRadius : height*0.2,
        padding : height*0.02
    },
    listWrapper : {
        flex:2,
        height : height*0.4,
    },
    waiting : {
        marginTop : height*0.15,
    },
    buttonStyle : {
        backgroundColor : 'white',
        borderColor : 'black',
        borderWidth : 1,
    },
    modalText : {
        fontWeight : 'bold',
        fontSize : height*0.02,
        marginVertical : height*0.02,
    }
})