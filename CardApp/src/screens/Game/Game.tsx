import React,{Component,useState,useEffect} from "react";
import {StyleSheet,View,Text,Dimensions,Image,TouchableOpacity,Platform} from "react-native"
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

let height = Dimensions.get('screen').height;
let width  = Dimensions.get('screen').width;


export const Game = (props:GameProps) =>
{
    // STATE ET VARIABLES
    
    // On récupère le role initial, le pseudo et l'identifiant de partie depuis les props du navigator.
    let [playerRole,setPlayerRole] = useState<string>(props.route.params?.playerRole); 
    const gameId = props.route.params?.gameId;
    const playerName = props.route.params?.playerName;

    // Liste des joueurs et nom de l'hôte pour l'affichage du tout premier tour.
    // Le choix a été fait de faire piocher l'hôte de la partie en premier.
    const [playersList,setPlayersList] = useState<Array<any>>([]);
    const [host,setHost] = useState<string>()

    // Booléen pour l'apparition des composants ModalPopUp (fin de partie, infos)
    const [infoVisible,setInfoVisible] = useState<boolean>(false);
    const [leaveGameVisible,setLeaveGameVisible] = useState<boolean>(false);
    const [gameOverVisible, setGameOverVisible] = useState<boolean>(false); 

    // Gestion du tour par tour.
    const [currentPlayer, setCurrentPlayer] = useState<string>(playersList[0]);
    const [previousPlayer, setPreviousPlayer] = useState<string>(playersList[0]);
    const [currentTurn,setCurrentTurn] = useState<boolean>();

    // Stockage de l'objet Deck et de la dernière carte tirée. Mis à jour à chaque nouvelle pioche.
    const [deck,setDeck]=useState<Deck>(new Deck());
    const [lastCardPicked, setLastCardPicked] = useState<Card>(new Card("BackCovers",3)); // Gestion état : cartes tirées

    // Booléen mis à jour après chaque tirée. Plus de cartes dans le deck = gameOver
    const [isGameOver,setIsGameOver] = useState<boolean>(false)

    // On instancie la BDD.
    let database = firebase.default.database();


    useEffect(()=>{
        console.log('\nPrevious player : ',previousPlayer,'  Current player : ',currentPlayer)
    },[previousPlayer,currentPlayer])

    // SET-UP ET GESTION DE componentDidMount ET componentWillUnmmount.
    useEffect(()=>{
        // componentDidMount
        
        // Initialisation de tous les events listeners.

        getPlayerList();
        setFirstTurn();
        playerAdded();
        changeRole();
        listenForTurnToChange();
        listenForCardPickedUpdate();
        listenForGameOver();
        listenForDeckUpdate();


        console.log('Game did mount.');
        console.log('Height : ', height,' Width : ', width);

        if(playerRole=='host') // Pour que le set-up ne soit fait qu'une fois.
        {
            console.log('Setting up deck card..')
            setUp();
            console.log('Game started.');
            
        }
        else{
            do{
                console.log('Waiting for game to start...');
            }
            while(!listenForSetUp()) // Les guests attendent que le set-up soit terminé.
            console.log('Game started.')
        }

        if(playersList.length!=0) console.log('players list : ',playersList)

        return () => {
            console.log('Game will unmount.')
            database.ref().off(); // Inverse de l'initalisation des events listeners. 
        };
      },
      []);


      // FONCTIONS COMPONENTDIDMOUNT

      // Mise en place de la partie et inialisation du deck etc..
      const setUp = async ()=>{
        // Création d'un nouveau deck de cartes
        let deck = new Deck();

        // On mélange le deck.
        deck.shuffle();

        console.log('Deck : ',deck)

        await database.ref('games/'+gameId+'/').update({
            deck,
            lastCardPicked : ["BackCovers",3]
        })

        database.ref('games/'+gameId+'/').update({
            status : 'started'
        })

        database.ref('games/'+gameId).update({
            turns : ['Previous player slot', 'Current player slot']
        })

        // MAJ du state pour l'hôte.
        setDeck(deck);
      }
      // Au début on dit que c'est à l'hôte de jouer.
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
      // Fetch player list depuis firebase db
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
        console.log('Liste des joueurs : ',list)
        setHost(list[0][0])
        setCurrentPlayer(list[0][0])
        setPreviousPlayer(list[1][0])
        setPlayersList(list);
    }



    // LISTENERS

    // Dès que le tour est modifié en BDD on l'update dans le state.
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
    // Dès qu'un autre appareil modifie le deck en BDD on met à jour le state sur chacun des autres.
    const listenForDeckUpdate = async ()=> {
        await database.ref('games/'+gameId+'/deck').on('value',(snapshot)=>{
          console.log('Deck updated.');
          let deck = snapshot.val() as Deck;
          setDeck(deck);
        })
    }
    // Idem pour la dernière carte tirée
    const listenForCardPickedUpdate = async ()=> {      
        await database.ref('games/'+gameId+'/lastCardPicked').on('value',(snapshot)=>{
            console.log('Last card picked updated.');
            console.log('Card : ',snapshot.val())
            if(snapshot.val()!=null){
                let card = snapshot.val() as string[];
                setLastCardPicked(new Card(card[0],card[1]));
            }
            })       
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
    })
    }
    // Update state if role is changed to host
    const changeRole = () => {
        database.ref('games/'+gameId).on('value',(snapshot)=>{
            let host = snapshot.child('host').val();
            if(host==playerName){
                setPlayerRole('host');
            }
        })
    }





    // UPDATE DB METHODS

    //Dès qu'une carte est piochée on update la database pour l'affichage de la carte en question pour tout le monde.
    const updateDB = async (card : Card) => {
        await database.ref('games/'+gameId).update({
            deck : deck,
            lastCardPicked : [card.suit,card.value]
        })
    }
    // Met à jour le tour en BDD
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




    // PIOCHE CARTE

    // Gathers all the actions needed when the player picks a card
    const handlePickCard = () => {

        // GESTION DECK       
        console.log('\nPicking a card.');
        console.log('Deck : ', deck,' nombre de cartes : ',deck.cards.length);
        let card = pickCard() as Card;
        console.log('Card picked : ',card)
        console.log('Deck : ', deck,' nombre de cartes : ',deck.cards.length);

        if(deck.cards.length==0){
            handleGameOver()
        }
        else{
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
    }
    // Pioche une carte au hasard dans le deck.
    const pickCard = ()=>{

        // Make game over popup appear
        const randomIndex = Math.floor(Math.random()*deck.cards.length); // Entier aléatoire entre 0 et le nombre de cartes dans le deck -1.
        let card = deck.cards[randomIndex];
        deck.cards.splice(randomIndex,1);
        if(deck==null){
            console.log("You've picked the last card.");
            handleGameOver()
        }
        return card;
        
       
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

    const getHost =  () =>{
        let host ="l'hôte"
        database.ref('games/'+gameId).child('host').once('value').then((snapshot)=>{
            console.log(snapshot.val())
            return snapshot.val();
        });
        
        return host
    }





    // QUITTER LA PARTIE

    // Gère le cas où un joueur quitte la partie.
    const leaveGame = async () =>{

        console.log('Leaving the game..') 
        console.log('Résultat wasHost() : ',await wasHost())
        // Check if that player was the last one to leave the game.
        console.log('Checking if player was the last one to leave the game...')
        
        // Si le joueur quitte alors que c'était à son tour de jouer, on change le tour sans piocher de carte.
        if(currentTurn){
            let index  = getIndex();
            // Récupérer le pseudo du joueur d'après avec l'index n+1
            let pseudo = playersList[(index+1)%(playersList.length)][0];
            // Update turns
            updateTurn(playerName, pseudo)
        }

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
                setHost(newHostPseudo)
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
    // Si le joueur pioche la dernière carte la partie est finie et on met à jour la BDD.
    const handleGameOver = () => {
        database.ref('games/'+gameId).set({status : 'over'});
        setGameOverVisible(true)
        setIsGameOver(true);
    }
    // Déclenché si un autre joueur pioche la dernière carte.
    const listenForGameOver = () => {
        database.ref('games/'+gameId+'/status').on('value',(snapshot)=>{
            if(snapshot.val()=='over'){
                setIsGameOver(true)
                setGameOverVisible(true)
            }
        })
    }
    // Détermine si le joueur était le dernier connecté à la partie.
    const wasLastPlayer = async () => {
        let id = gameId;
        let data = await database.ref('players/'+id).once('value');
        let numberOfPlayers = data.numChildren();
        if(numberOfPlayers===1)
        {return true}
        else{return false}
    }
    // Détermine si le joueur était l'hôte pour réattribuer le rôle.
    const wasHost = async () => {
    let data = await database.ref('players/'+gameId+'/'+playerName).once('value');
    let role =  data.child('role').val();
    console.log(data.val())
    console.log('role :',role)
    if(role=='host'){ return true}
    else{ return false }
    }



    // RENDER

    // Affichage dynamique du tour par tour
    const renderPlayersTurn =  () => {      
        if(!isGameOver){
            if(deck!=null){
                if(deck.cards.length==52){
                    let host = getHost()
                    return(
                        <View style={styles.playersTurnWrapper}>
        
        
                            <View style={styles.firstRoundPlayerNameWrapper}>
                                <Text style={styles.playerText}>
                                    C'est à {host} de tirer
                                </Text>
                            </View>
        
                        </View>
                    )
                }
                else{
                    return(
                        <View style={styles.playersTurnWrapper}>
        
        
                            <View style={[styles.playerNameWRapper,{maxHeight:height*0.2,width:width*0.8}]}>
                                <Text style={styles.playerText}>
                                    AU TOUR DE : {currentPlayer.toUpperCase()}
                                </Text>
                            </View>
        
                            <View style={styles.playerNameWRapper}>
                                <Text style={styles.playerText}>
                                    {previousPlayer.toUpperCase()} A TIRE :
                                </Text>
                            </View>
        
                        </View>
                    )
                }
            }
        }

    }
    // Affichage dynamique des cartes.
    const renderCardImage = () =>
    {
        if(!isGameOver){
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
        else{
            let image = requireCard('BackCovers',3);
            return(
                <Image 
                    source={image}
                    resizeMode='stretch'
                    style={styles.card}

                />  
            )
        }
    }




    
    return(
            <View style={styles.container}>

                <ModalPopUp visible={gameOverVisible}  >       
                    <View style={{height : height*0.3, padding : '10%'}}>
                        <Text style={styles.title}>Partie terminée !</Text>
                        <Button buttonStyle={styles.buttonStyle} text="ACCUEIL" onPress={()=>{setGameOverVisible(false); props.navigation.navigate('Home')}}></Button>
                    </View>
                </ModalPopUp>

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
                    <View style={{padding:'5%'}}>
                        <Text style={styles.popUpText}>
                            GAME ID : {gameId}
                        </Text>
                        <Text style={styles.popUpText}>
                            ROLE : {playerRole}
                        </Text>
                        <Button buttonStyle={styles.buttonStyle} text="QUITTER" onPress={()=>{setInfoVisible(false); setLeaveGameVisible(true)}}></Button>
                    </View>
                </ModalPopUp>

                <ModalPopUp visible={leaveGameVisible}>
                    <View>
                        <Text style={styles.modalText}>
                            QUITTER LA PARTIE ?
                        </Text>
                        <Button buttonStyle={styles.buttonStyle} text="OUI" onPress={leaveGame}></Button> 
                        <Button buttonStyle={styles.buttonStyle} text="NON" onPress={()=>{setLeaveGameVisible(false)}}></Button>
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

                {renderPlayersTurn()}
                
                <View style={styles.cardWrapper}>
                    <View style={styles.stack}>
                        {renderCardImage()}
                    </View>

                </View>

                <Button text="PIOCHE" buttonStyle={[styles.buttonStyle,(!currentTurn)?styles.opacityLow:{}]}textStyle={styles.buttonText} onPress={((currentTurn)&&!isGameOver)?()=>handlePickCard():()=>console.log('Not your turn ! / Game over ')}>
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
        backgroundColor:colors.backGroundColor,
        paddingVertical : '5%'
    },
    title:{
        fontSize:height/22.5, 
        fontWeight:'bold',
        marginBottom:'5%',
        textAlign:'center'
    },
    card :{
        height:380/(height*0.0012),
        width:255/(height*0.0012),
        marginVertical : height*0.1 
    },
    buttonText : {
        fontSize : width*0.08
    },
    pickButton : {
        padding : height*0.08,
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
        display:'flex',
        padding : '5%',
        minHeight : height*0.1,
        
    },
    playerNameWRapper :{
        justifyContent:'center',
        alignItems:'center',
        flex : 1,
        width : width*0.8,
        minHeight : height*0.008,
        backgroundColor:'white',
        borderColor :'black',
        borderWidth : 2,
        borderRadius :height*0.06,
        marginVertical:'2%',
        padding:'5%'
    },
    firstRoundPlayerNameWrapper : {
        justifyContent:'center',
        alignItems:'center',
        flex : 1,
        width : width*0.8,
        height : height*0.008,
        backgroundColor:'white',
        borderColor :'black',
        borderWidth : 2,
        borderRadius :height*0.06,
        marginVertical:'2%',
        //padding:'5%'
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
        marginVertical : '5%'
    },
    buttonStyle : {
        backgroundColor : 'white',
        borderColor : 'black',
        borderWidth : 1,
        padding:'5%',
        minHeight : height*0.09
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


