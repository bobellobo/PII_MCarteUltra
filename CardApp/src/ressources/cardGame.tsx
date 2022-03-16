import React from 'react';

const SUITS = ["Spades", "Clubs", "Hearts", "Diamonds"]

const VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13]


export class Card {
    suit : string
    value : number
    constructor( suit: any ,value: any){
        this.suit = suit,
        this. value = value
    }

    toString(){
        return(this.value+" "+this.suit)
    }
}

export default class Deck {
    
    cards : Card[]
    constructor(cards=newDeck()){
        this.cards = cards
    }

    get numberOfCards(){
        return this.cards.length
    }

    shuffle(){
        for(let i=this.numberOfCards -1; i>0; i--){
            const newIndex = Math.floor(Math.random()*(i+1));
            const oldValue= this.cards[newIndex];
            this.cards[newIndex]=this.cards[i];
            this.cards[i]=oldValue;
        }
    }

    pickCard(){
        const randomIndex = Math.floor(Math.random()*this.numberOfCards);  // Entier aléatoire entre 0 et le nombre de cartes dans le deck -1.
        let card = this.cards[randomIndex];
        this.cards.splice(randomIndex,1);
        return card;       
    }
}

function newDeck(){
    return SUITS.flatMap(suit=>{
        return VALUES.map(value=>{
            return new Card(suit,value)
        })
    })
}