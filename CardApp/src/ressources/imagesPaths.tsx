import React from "react"

export const requireCard = (suit? : string , value? : number) => {
     
    if(suit){  
        if(value)
        {
            switch(suit){
            case("Spades"):
            return Spades[value-1]
            break;
            case("Clubs"):
            return Clubs[value-1]
            break;
            case("Diamonds"):
            return Diamonds[value-1];
            break;
            case("Hearts"):
            return Hearts[value-1];
            break;
            case("BackCovers"):
            return BackCovers[value-1];
            break;
            }
        }            
    }    
}

let Spades =[
    require('~/ressources/cards/Spades/A.png'),
    require('~/ressources/cards/Spades/2.png'),
    require('~/ressources/cards/Spades/3.png'),
    require('~/ressources/cards/Spades/4.png'),
    require('~/ressources/cards/Spades/5.png'),
    require('~/ressources/cards/Spades/6.png'),
    require('~/ressources/cards/Spades/7.png'),
    require('~/ressources/cards/Spades/8.png'),
    require('~/ressources/cards/Spades/9.png'),
    require('~/ressources/cards/Spades/10.png'),
    require('~/ressources/cards/Spades/J.png'),
    require('~/ressources/cards/Spades/Q.png'),
    require('~/ressources/cards/Spades/K.png'),
]
let Diamonds =[
    require('~/ressources/cards/Diamonds/A.png'),
    require('~/ressources/cards/Diamonds/2.png'),
    require('~/ressources/cards/Diamonds/3.png'),
    require('~/ressources/cards/Diamonds/4.png'),
    require('~/ressources/cards/Diamonds/5.png'),
    require('~/ressources/cards/Diamonds/6.png'),
    require('~/ressources/cards/Diamonds/7.png'),
    require('~/ressources/cards/Diamonds/8.png'),
    require('~/ressources/cards/Diamonds/9.png'),
    require('~/ressources/cards/Diamonds/10.png'),
    require('~/ressources/cards/Diamonds/J.png'),
    require('~/ressources/cards/Diamonds/Q.png'),
    require('~/ressources/cards/Diamonds/K.png'),
]
let Clubs =[
    require('~/ressources/cards/Clubs/A.png'),
    require('~/ressources/cards/Clubs/2.png'),
    require('~/ressources/cards/Clubs/3.png'),
    require('~/ressources/cards/Clubs/4.png'),
    require('~/ressources/cards/Clubs/5.png'),
    require('~/ressources/cards/Clubs/6.png'),
    require('~/ressources/cards/Clubs/7.png'),
    require('~/ressources/cards/Clubs/8.png'),
    require('~/ressources/cards/Clubs/9.png'),
    require('~/ressources/cards/Clubs/10.png'),
    require('~/ressources/cards/Clubs/J.png'),
    require('~/ressources/cards/Clubs/Q.png'),
    require('~/ressources/cards/Clubs/K.png'),
]
let Hearts =[
    require('~/ressources/cards/Hearts/A.png'),
    require('~/ressources/cards/Hearts/2.png'),
    require('~/ressources/cards/Hearts/3.png'),
    require('~/ressources/cards/Hearts/4.png'),
    require('~/ressources/cards/Hearts/5.png'),
    require('~/ressources/cards/Hearts/6.png'),
    require('~/ressources/cards/Hearts/7.png'),
    require('~/ressources/cards/Hearts/8.png'),
    require('~/ressources/cards/Hearts/9.png'),
    require('~/ressources/cards/Hearts/10.png'),
    require('~/ressources/cards/Hearts/J.png'),
    require('~/ressources/cards/Hearts/Q.png'),
    require('~/ressources/cards/Hearts/K.png'),
]

let BackCovers = [
    require('~/ressources/cards/BackCovers/Emerald.png'),
    require('~/ressources/cards/BackCovers/PeterRiver.png'),
    require('~/ressources/cards/BackCovers/Pomegranate.png'),
    require('~/ressources/cards/BackCovers/SunFlower.png'),
]
