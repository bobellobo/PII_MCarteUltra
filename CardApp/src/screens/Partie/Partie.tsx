import React, {useState, useEffect} from "react"
import {View, Text, StyleSheet, Image,Modal, TouchableOpacity} from "react-native"
import {RouteParams} from "~/navigation/RootNavigator"
import {useRoute, useNavigation, RouteProp, NavigationContainer} from "@react-navigation/native"
import * as ScreenOrientation from 'expo-screen-orientation'
import {BackHomeButton} from "~/components/BackHomeButton"
import { PORTRAIT } from "react-native-orientation-locker"
import Deck, { Card } from "~/ressources/cardGame"
import { ModalPopUp } from "~/components/ModalPopUp"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Home } from '~/screens/Home';
import { requireCard } from "~/ressources/imagesPaths"






var deck : Deck;


export const Partie : React.FunctionComponent<{}> = ({}) => {

  const route = useRoute<RouteProp<RouteParams>>(); 
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  const playersList = route.params?.playerList as string[];
  
  
  ScreenOrientation.unlockAsync();
  //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

  useEffect(()=>{
    //console.log('Partie mounted.');
    setUp();
    return () => {
      setUp();
      setGameOverVisible(false);
    };
  },[]);

  const setUp = ()=>{

    deck = new Deck();
    deck.shuffle();
    updateCurrentPlayer(playersList[0]);
    updateNextPlayer(playersList[1]);
  }
  
  // STATE MANAGEMENT
  const [lastCardPicked, updateLastCardPicked] = useState<Card>(); // Gestion état : cartes tirées
  const [currentPlayer, updateCurrentPlayer] = useState<string>('');
  const [nextPlayer, updateNextPlayer] = useState<string>('');
  const [gameOverVisible, setGameOverVisible] = useState<boolean>(false);
  const [firstRound, setFirstRound] = useState<boolean>(true);
  //const [cardPath, setCardPath] = useState<string>('~/ressources/cards/BackCovers/Emerald.png');

  let UNIQUE_PLAYER = playersList[0];

  
  const gameOver = () => {
    return(
      deck.numberOfCards!=0 ? false : true 
    )
  }

  const drawCard = () =>
  {   
    // Mise à jour carte tirée.
    if(!gameOver())
    {
      let pickedCard = deck.pickCard();
      updateLastCardPicked(pickedCard);
      if(deck.numberOfCards<52){
        setFirstRound(false);
      }

    
      // Mise à jour tour joueurs.
      let indexCurrent = playersList.indexOf(currentPlayer);
      let indexNext = playersList.indexOf(nextPlayer);
      let numberOfPlayers = playersList.length;
      updateCurrentPlayer(playersList[(indexCurrent+1)%numberOfPlayers]);
      updateNextPlayer(playersList[(indexNext+1)%numberOfPlayers]);
    }
    else
    {
      // Game Over Modal Pop up
      setGameOverVisible(true);
    }
    
  }
  
// Fonction qui renvoie un render avec l'affichage des tours des joueurs.

  const renderPlayerTurn = () => {

      // S'IL N'Y A QU'UN JOUEUR.
      if(playersList.length==1)
      {
        return(
          <View style={styles.turnHeader}>
        
              <View style={styles.lastPlayerWrapper}>
                  <Text style={styles.title}>Vous avez tiré : </Text>
              </View> 
              
          </View>
        );
      }
      else{
        // AFFICHAGE DIFFERENT S'IL S'AGIT DU PREMIER TOUR.
        if(firstRound)
        {
          return(
            <View style={styles.turnHeader}>
        
              <View style={styles.lastPlayerWrapper}>
                  <Text style={styles.title}>C'est au tour de :</Text>
                  <Text style={styles.title}>{currentPlayer}</Text>
              </View> 

            </View>
          );
        }

        // AFFICHAGE "NORMAL".
        else
        {
          return(
            <View style={styles.turnHeader}>
        
              <View style={styles.lastPlayerWrapper}>
                  <Text style={styles.title}>C'est au tour de :</Text>
                  <Text  style={styles.title}>{currentPlayer}</Text>
              </View>

              <View style={styles.nextPlayerWrapper}>
                <Text style={styles.title} >{nextPlayer} a tiré :</Text>   
              </View>
        
            </View>
          );
        };
      }
  }

  // METHODE RENDER POUR L'AFFICHAGE DYNAMIQUE DES CARTES.

  const renderCardImage = () =>
  {
    let suit = lastCardPicked?.suit as string;
    let value = lastCardPicked?.value as number;

    // FONCTION requireCard IMPORTEE DEPUIS imagePaths.tsx POUR GENERER DYNAMIQUEMENT LES IMAGES DES CARTES.
    let image = requireCard(suit,value);
    
      return(
        <Image 
            source={image}
            resizeMode='contain'
            style={{
              maxHeight:0.6*380,
              maxWidth:0.6*255,}}

        />  
      )
  }



  return(
    
    
    <View style={styles.container}> 

      <ModalPopUp visible={gameOverVisible} >       
        <Text style={styles.title}>Partie terminée !</Text>
        <TouchableOpacity style={styles.gameEndedButton} onPress={()=>{
          setGameOverVisible(false);
          navigation.navigate("Home");
          }}>
          <Text>Retour à l'accueil</Text>
        </TouchableOpacity>
      </ModalPopUp>

      {renderPlayerTurn()}

      <View style={styles.backHomeButton}>
        <BackHomeButton/>
      </View>

      
      
      <View style={styles.board}>       
        <View style={styles.stack}>
            <TouchableOpacity  onPress={()=>drawCard()}
            style={{borderColor :'black',borderWidth:1,borderRadius :7,}}>
              <Image 
              source={requireCard("BackCovers",3)}
              resizeMode='contain'
              style={{
                maxHeight:0.6*380,
                maxWidth:0.6*255,
              }}         
              />            
            </TouchableOpacity>
            <View style={styles.card}>{renderCardImage()}</View>
            
        </View>
        
      </View>
      
      
      
      
    </View>
    
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    flexWrap:'wrap',
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  backHomeButton :{
    position :'absolute',
    top:10,
    right : 10,
  },

  gameEndedButton : {
    margin : 10,
    marginTop : 15,
    borderColor:'red',
    backgroundColor:"rgba(255,90,90,0.1)",
    borderWidth:1,
    borderRadius:5,
    padding : 10
  },
  title : {
    fontSize:30,
    fontWeight:'400',
  },
 
  turnHeader : {
    flex:1,
    flexWrap : "wrap",
    alignItems:'center',
    justifyContent :"center",
    alignContent:'center',
    padding : 10,
    top:0,
    left:0,
    width : '100%',

  },

  card :{
    borderWidth:1,
    borderColor:'black',
    borderRadius:7,
    margin : 10
  },

  board : {
    flex:2,
    alignContent:'center',
    justifyContent:'center',

  },

  stack : {
    flexDirection:'row',
    justifyContent:'center',
    alignItems :'center',
    maxHeight:250,
  },

  nextPlayerWrapper : {
    flex :1,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
  },
  lastPlayerWrapper : {
    flex :2,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center'
  },

});






