import React, {useState, useEffect} from "react"
import {View, Text, StyleSheet, Image,Modal, TouchableOpacity} from "react-native"


interface ModalPopUpProps {
    visible : boolean
    children : any
  }

export const ModalPopUp  : React.FunctionComponent<ModalPopUpProps> = ({visible, children}) => {

    const [show, setShow] = useState<boolean>(visible)
    
    useEffect(()=> {
      toggle()
    },[visible]);

    const toggle = () => {
      if(visible){
        setShow(true);
      }
      else{
        setShow(false);
      }
    }
    return(

      <Modal transparent visible={visible}>
        <View style={modalStyle.modalBackGround}>
          
          <View style={[modalStyle.modalContainer]}>
            
            {children}
            
            
          </View>
        </View>
  
      </Modal>
    )
  }

  // A RAJOUTER POUR AVOIR UN BOUTON DE FERMETURE DE LA FENETRE.
  // <TouchableOpacity onPress={()=> <setState>(false)}style={{position:'absolute',top:10,right:10,}}>
  //               <Image style={{height:30,width:30,tintColor:'rgba(0,0,0,0.5)' }} source={require("~/ressources/icons/remove.png")}/>
  // </TouchableOpacity>
  
  const modalStyle = StyleSheet.create({
    modalBackGround : {
      flex :1,
      backgroundColor:'rgba(0,0,0,0.5)', // Noir avec 50% opacité.
      justifyContent :'center',
      alignItems:'center'
    },
    modalContainer : {
      width :'80%',
      backgroundColor :'#FFF',
      paddingHorizontal:20,
      paddingVertical:30,
      borderRadius:20,
      elevation:20,
      alignItems:'center',
      justifyContent : "center",
    },
    leaveButton : {
      position :'absolute',
      backgroundColor : 'red',
      height:30,
      width:30,
      
    }
  
  })