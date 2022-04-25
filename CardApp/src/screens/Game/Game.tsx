import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions,Image,TouchableOpacity} from "react-native"
import {colors} from "~/constants/colors";
import {firebase} from "~/firebase/config"
import * as ScreenOrientation from 'expo-screen-orientation'
import Deck, { Card } from "~/ressources/cardGame"
import { requireCard } from "~/ressources/imagesPaths"
import Button from "~/components/Button";
import { ModalPopUp } from "~/components/ModalPopUp";

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
    const [playersList,setPlayersList] = useState<Array<any>>([]); // Remettre à []
    let [playerRole,setPlayerRole] = useState<string>(props.route.params?.playerRole); 
    let database = firebase.default.database();
    const [infoVisible,setInfoVisible] = useState<boolean>(false)
    const [leaveGameVisible,setLeaveGameVisible] = useState<boolean>(false)


    const [currentTurn,setCurrentTurn] = useState<boolean>();//((playerRole=='host')?true:false);
    const [deck,setDeck]=useState<Deck>(new Deck());
    const [lastCardPicked, setLastCardPicked] = useState<Card>(new Card("BackCovers",3)); // Gestion état : cartes tirées
    const [currentPlayer, setCurrentPlayer] = useState<string>(playersList[0]);
    const [previousPlayer, setPreviousPlayer] = useState<string>(playersList[0]);
    const [gameOverVisible, setGameOverVisible] = useState<boolean>(false); // Apparition pop-up de fin de jeu.


    useEffect(()=>{
        console.log('\nPrevious player : ',previousPlayer,'  Current player : ',currentPlayer)
    },[previousPlayer,currentPlayer])
    useEffect(()=>{
        // componentDidMount

        // Events and database update listeners
        getPlayerList();
        setFirstTurn();
        playerAdded();
        changeRole();
        listenForTurnToChange();
        listenForCardPickedUpdate();
        listenForDeckUpdate();

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



        if(playersList.length!=0) console.log('players list : ',playersList)
        return () => {
            console.log('Game will unmount.')
            setLeaveGameVisible(true);
        };
      },
      []);


      const setUp = async ()=>{

        // Création d'un nouveau deck de cartes
        let deck = new Deck();

        // On mélange le deck.
        deck.shuffle();
        console.log('Deck : ',deck)

        await database.ref('games/'+gameId+'/').set({
            deck,
            lastCardPicked : ["BackCovers",3]
        })

        database.ref('games/'+gameId+'/').update({
            status : 'started'
        })

        database.ref('games/'+gameId).update({
            turns : ['Previous player slot', 'Current player slot']
        })
        setDeck(deck);
      }

      // Set players/gameId/[player] : {currentTurn : true/false}
      const setFirstTurn = async () => {
        if(playerRole=='host'){
            // Set currentTurn true
            database.ref('players/'+gameId+'/'+playerName).update({currentTurn : true})
            setCurrentTurn(true);
        }
        else{
            // Set currentTurn false
            database.ref('players/'+gameId+'/'+playerName).update({currentTurn : false} )
            setCurrentTurn(false);
        }
      }

      // Updating players turn
      const listenForTurnToChange = async () => {
        await database.ref('players/'+gameId+'/'+playerName+'/currentTurn').on('value', (snapshot)=>{
            let result = snapshot.val()
            console.log((result)?'It is now your turn.':"It is not your turn yet/anymore.")
            setCurrentTurn(result);
        })
        await database.ref('games/'+gameId+'/turns').on('value', (snapshot)=>{
            let turns = snapshot.val() as string[];
            if(turns!=undefined){
                setPreviousPlayer(turns[0])
                setCurrentPlayer(turns[1])
                console.log('Result turns : ',turns)
            }
            else{
                console.log('UNDEFINED')
            }
            
        })
      }


      // Return true if set up is achieved correctly on the host device, else false.
      const listenForSetUp = async () => {
          await database.ref('games/'+gameId+'/status/').on('value',(snapshot)=>{
            let status = snapshot.val();
            if(status=='started'){
                return true
            }
            else return false
          })
      }


      // Fetch player list from firebase db
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
        console.log('liste : ',list)
        setCurrentPlayer(list[0][0])
        setPreviousPlayer(list[1][0])
        setPlayersList(list);
    }

    // Affichage dynamique des cartes.
    const renderCardImage = () =>
    {
        let suit = lastCardPicked?.suit as string;
        let value = lastCardPicked?.value as number;

        //  requireCard() importée depuis imagePaths.tsx.
        let image = requireCard(suit,value);
        
        return(
            <Image 
                source={image}
                resizeMode='stretch'
                style={styles.card}

            />  
        )
    }

    // Gathers all the actions needed when the player picks a card
    const handlePickCard = () => {
        // GESTION DECK
        console.log('\nPicking a card.');
        console.log('Deck : ', deck,' nombre de cartes : ',deck.cards.length);
        // drawCard
        let card = pickCard();
        console.log('Card picked : ',card)
        console.log('Deck : ', deck,' nombre de cartes : ',deck.cards.length);
        
        // updateDeck in db and in app state for everyone
        // update last card picked for everyone
        setLastCardPicked(card)
        updateDB(card)

        // GESTION TOUR
        //  Récupérer index du joueur dans playersList
        let index  = getIndex();
        // Récupérer le pseudo du joueur d'après avec l'index n+1
        let pseudo = playersList[(index+1)%(playersList.length)][0];
        // Update turns
        updateTurn(playerName, pseudo)

    }

    // Select a random card in the deck.
    const pickCard = ()=>{
        const randomIndex = Math.floor(Math.random()*deck.cards.length); // Entier aléatoire entre 0 et le nombre de cartes dans le deck -1.
        let card = deck.cards[randomIndex];
        deck.cards.splice(randomIndex,1);
        return card;       
    }

    // Updating deck and lastCardPicked values after picking a card.
    const updateDB = async (card : Card) => {
        await database.ref('games/'+gameId).update({
            deck : deck,
            lastCardPicked : [card.suit,card.value]
        })
    }

    // Event listener to udpate state deck
    const listenForDeckUpdate = async ()=> {
        await database.ref('games/'+gameId+'/deck').on('value',(snapshot)=>{
          console.log('Deck updated.');
          let deck = snapshot.val() as Deck;
          setDeck(deck);
        })
    }

    // Event listener to udpate state lastCardPicked
    const listenForCardPickedUpdate = async ()=> {
        await database.ref('games/'+gameId+'/lastCardPicked').on('value',(snapshot)=>{
          console.log('Last card picked updated.');
          console.log('DATA : ',snapshot.val())
          let card = snapshot.val() as string[];
          setLastCardPicked(new Card(card[0],card[1]));
        })
    }

    // Récupère l'index du joueur dans la liste playersList du state.
    const getIndex = () => {
        let _index=-1;
        let element = [playerName,playerRole]
        playersList.forEach((value:any,index:number)=>{
            if (value[0]==element[0]&&value[1]==element[1]) {
                _index = index
            }
        })
        return _index;
    }

    // Update players turn.
    const updateTurn = async (currentPseudo : string, nextPseudo : string) => {

        // Set turn false pour le joueur qui vient de tirer
        database.ref('players/'+gameId+'/'+currentPseudo).update({
            currentTurn : false
        }).then(()=>{console.log('Not ',currentPseudo,' turn anymore.')}
        ).catch((error)=>console.log('Erreur updating turns : ',error))
        // Set turn true pour le joueur n+1
        database.ref('players/'+gameId+'/'+nextPseudo).update({
            currentTurn : true
        }).then(()=>{console.log('Now ',nextPseudo,"'s turn.")})
        .catch((error)=>console.log('Erreur updating turns : ',error))

        // Set un objet turn dans games/id/turn pour pouvoir le récupérer dans listenForTurnToChange()
        // Nécessaire pour faciliter le rendu dynamique des tours en haut de l'écran.
        database.ref('games/'+gameId).update({
            turns : [currentPseudo,nextPseudo]
        }).then(()=>{console.log('Updated turns')})
        .catch((error)=>console.log('Erreur updating turns : ',error))
    }

    // Gère le cas où un joueur quitte la partie.
    const leaveGame = async () =>{

        console.log('Leaving the game..') 
        console.log('Résultat wasHost() : ',await wasHost())
        // Check if that player was the last one to leave the game.
        console.log('Checking if player was the last one to leave the game...')

        if(await wasLastPlayer()){
            console.log(playerName, 'was not the last player to leave the game.')
            database.ref('games/'+gameId).remove()
            .then(()=>{console.log('Game removed succesfully')})
            .catch((error)=>{console.log('Error : ', error)})
            database.ref('players/'+gameId).remove()
            .then(()=>{console.log('Players removed succesfully')})
            .catch((error)=>{console.log('Error : ', error)})
        }
        else{
            console.log(playerName, 'was not the last player.')
            console.log('Checking if ',playerName,' was host...')

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
                // Update Game Host
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
        setLeaveGameVisible(false);
        props.navigation.navigate("Home");
    }

    const wasLastPlayer = async () => {
        let id = gameId;
        let data = await database.ref('players/'+id).once('value');
        let numberOfPlayers = data.numChildren();
        if(numberOfPlayers===1)
        {return true}
        else{return false}
    }

    // Check if the player role was 'host' or not.
    const wasHost = async () => {
    let data = await database.ref('players/'+gameId+'/'+playerName).once('value');
    let role =  data.child('role').val();
    console.log(data.val())
    console.log('role :',role)
    if(role=='host'){ return true}
    else{ return false }
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

    // Update state if role is changed to host
    const changeRole = () => {
        database.ref('games/'+gameId).on('value',(snapshot)=>{
            let host = snapshot.child('host').val();
            if(host==playerName){
                setPlayerRole('host');
            }
        })
    }




    
    return(
            <View style={styles.container}>

                <ModalPopUp visible={infoVisible}>
                    <TouchableOpacity onPress={()=>{setInfoVisible(false)}} style={{position:'absolute',top:width*0.02,right:width*0.02}}>
                    <Image 
                        source={require('~/ressources/icons/remove.png')}
                        resizeMode='contain'
                        style = {{
                            width:40,
                            height : 40,
                            tintColor : 'red',
                            opacity:0.5,             
                        }}
                    />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.popUpText}>
                            GAME ID : {gameId}
                        </Text>
                        <Text style={styles.popUpText}>
                            Your role : {playerRole}
                        </Text>
                        <Button buttonStyle={styles.buttonStyle} text="QUITTER" onPress={()=>{setInfoVisible(false); setLeaveGameVisible(true)}}></Button>
                    </View>
                </ModalPopUp>

                <ModalPopUp visible={leaveGameVisible}>
                    <View>
                        <Text style={styles.modalText}>
                            QUITTER LA PARTIE ?
                        </Text>
                        <Button buttonStyle={styles.buttonStyle} text="Oui" onPress={leaveGame}></Button> 
                        <Button buttonStyle={styles.buttonStyle} text="Non" onPress={()=>{setLeaveGameVisible(false)}}></Button>
                    </View>
                </ModalPopUp>

                
                <View style={styles.infoWrapper}>
                    <TouchableOpacity onPress={()=>{setInfoVisible(true)}}>
                    <Image 
                        source={require('~/ressources/icons/info.png')}
                        resizeMode='contain'
                        style = {styles.infoButton}
                    />
                    </TouchableOpacity>
                    
                </View>

                <View style={styles.playersTurnWrapper}>

                    {(currentTurn)? <Text style={{textAlign:'center',justifyContent:'center'}}> Your turn !  </Text>: null}

                    <View style={styles.playerNameWRapper}>
                        <Text style={styles.playerText}>
                            AU TOUR DE : {currentPlayer}
                        </Text>
                    </View>

                    <View style={styles.playerNameWRapper}>
                        <Text style={styles.playerText}>
                            {previousPlayer} A TIRE :
                        </Text>
                    </View>

                </View>
                
                <View style={styles.cardWrapper}>
                    <View style={styles.stack}>
                        {renderCardImage()}
                    </View>

                </View>

                <Button text="PIOCHE" buttonStyle={[styles.buttonStyle,(!currentTurn)?styles.opacityLow:{}]}textStyle={styles.buttonText} onPress={(currentTurn)?()=>handlePickCard():()=>console.log('Not your turn ! ')}>
                    <Image
                        source={requireCard("BackCovers",3)}
                        style={styles.cardIcon}
                    />
                </Button>
                
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
    card :{
        height:380/Dimensions.get('window').scale*2,
        width:255/Dimensions.get('window').scale*2,
    },
    buttonText : {
        fontSize : height*0.04
    },
    pickButton : {
        padding : height*0.05,
        marginBottom : height*0.04,
    },
    cardIcon : {
        height:380/Dimensions.get('window').scale*0.3,
        width:255/Dimensions.get('window').scale*0.3,
        marginLeft : height*0.02,
        borderWidth :1,
        borderRadius : 2,
        borderColor:'black',
        transform : [{ rotate: '20deg' }]
    },
    stack : {
        flexDirection:'row',
        justifyContent:'center',
        alignItems :'center',
    },
    cardWrapper : {
        flex :3,
        justifyContent :'center',
        alignContent:'center',
        height:'100%',
        width:'100%'
    },
    playersTurnWrapper : {
        flex :1,
        justifyContent :'space-between',
        alignContent:'center',
        height : '100%',
        display:'flex',
        padding : '5%',
        minHeight : height*0.3,
        
    },
    playerNameWRapper :{
        justifyContent:'center',
        alignItems:'center',
        flex : 1,
        width : width*0.8,
        minHeight : height*0.08,
        backgroundColor:'white',
        borderColor :'black',
        borderWidth : 2,
        borderRadius :height*0.06,
        marginVertical:'2%',
        padding:'5%'
    },
    playerText : {
        textAlign :'center',
        fontSize : height*0.03
    },
    infoWrapper : {
        flex :1,
        width : '100%',
        maxHeight : height*0.07,
        flexDirection :'row',
        justifyContent :'flex-end',
        alignItems :'center',
    },
    infoButton : {
        width : width*0.1,
        height : width*0.1,
        margin :width*0.03

    },
    i : {
        textAlign :'center',
        fontWeight :'bold',
        fontSize : height*0.03
    },
    popUpText : {
        textAlign :'center',
        fontSize : height*0.03,
        fontWeight : 'bold',
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
    },
    opacityLow : {
        opacity :0.8
    }
})


