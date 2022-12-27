// Assigning JS variables to all the interactable DOM elements 
// I renamed the player and dealer hand with -DOM so I can track values elsewhere 
const dealerHandDOM = document.getElementById("dealer-hand");
const playerHandDOM = document.getElementById("player-hand");
const dealButton = document.getElementById("deal-button")
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const playAgainButton = document.getElementById("playAgain-button")
playAgainButton.toggleAttribute("disabled") 
const dealerPointsDOM = document.getElementById("dealer-points")
const playerPointsDOM = document.getElementById("player-points")
const messageBox = document.getElementById("messages")

// initializing stuff 
let playerHand = [];
let dealerHand = [];
let deck = [];
const suits = ["Coins", "Glyphs", "Stars", "Swords"];
const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// This block of code will fill out the deck array with the common deck. 
const makeCard = (rank, suit) => {
  const card = {
    suit: suit,
    rank: rank 
    // I'm letting the rank be the point value in my deck
  };
  deck.push(card);
};

for (let suit of suits) {
  for (let rank of ranks) {
    makeCard(rank, suit);
  }
}

// Adds select high deck cards to make a 52 card deck. Their suit will be their identity, 
// and all will have a rank of 10. 
deck.push({suit: "Beast",rank: 10});
deck.push({suit: "Artifact",rank: 10});
deck.push({suit: "Darklord",rank: 10});
deck.push({suit: "Donjon",rank: 10});
deck.push({suit: "Executioner",rank: 10});
deck.push({suit: "Ghost",rank: 10});
deck.push({suit: "Horseman",rank: 10});
deck.push({suit: "Innocent",rank: 10});
deck.push({suit: "Marionette",rank: 10});
deck.push({suit: "Mists",rank: 10});
deck.push({suit: "Raven",rank: 10});
deck.push({suit: "Seer",rank: 10});

// The Tempter and the Broken One were excluded to make the Tarokka deck 52 cars in total. 

// Let's make a function to shuffle the cards. This is the Fisher-Yates shuffle 
// Copied from StackOverflow: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

// Now we'll do stuff when the page loads.  
window.addEventListener("DOMContentLoaded", () => {
    deck = shuffle(deck) // shuffles the deck of cards 
    // disables the hit and stand buttons 
    hitButton.toggleAttribute("disabled")
    standButton.toggleAttribute("disabled")
    if (Number.isInteger(localStorage.getItem("dealerWins"))){ // if there isn't already storage of wins,
        localStorage.setItem("dealerWins",0) // start storing wins and set them to 0
        localStorage.setItem("playerWins",0)
    }
});

// Dealing code. First, we'll make a function that deals 
// the top card in the deck to the player we choose. 
const dealTopCardTo = (playerOrDealer) => {
    if (playerOrDealer == "player"){
        // First, put the numeric card in the numeric array 
        let newCardObj = deck.pop() // This says the last card in the deck array represents the top card. That's fine.
        playerHand.push(newCardObj) 
        // Then put the image on the "table" on the DOM. 
        let newCardImg = document.createElement("img") // Create an img element
        // make that image element the right card 
        newCardImg.src = `./Assets/${newCardObj.rank}of${newCardObj.suit}.png`
        playerHandDOM.append(newCardImg) // put it on the webpage 
    } else { // This is all the same as above, but with the dealer's hand 
        let newCardObj = deck.pop() 
        dealerHand.push(newCardObj) 
        let newCardImg = document.createElement("img") 
        newCardImg.src = `./Assets/${newCardObj.rank}of${newCardObj.suit}.png`
        newCardImg.className = "faceUp"
        dealerHandDOM.append(newCardImg) 
    }
}

// Now we need a function to flip the dealer's first card. 
const flipFirstDealerCard = () => {
    // This should flip the first card to its front side 
    if (dealerHandDOM.firstElementChild.className == "faceDown"){
        dealerHandDOM.firstElementChild.src = `./Assets/${dealerHand[0].rank}of${dealerHand[0].suit}.png`
        dealerHandDOM.firstElementChild.className = "faceUp"
    } else { // flips the card to the back if it's face up. 
        dealerHandDOM.firstElementChild.src = "./Assets/tarokkaBack.png"
        dealerHandDOM.firstElementChild.className = "faceDown"
    }
}

// When you click the deal button, it deals one card to the player, 
// then dealer (then flips that card over), then player, then dealer.
dealButton.addEventListener("click", () => {
    dealTopCardTo("player")
    dealTopCardTo("dealer") 
    flipFirstDealerCard()
    dealTopCardTo("player")
    dealTopCardTo("dealer") 
    dealButton.toggleAttribute("disabled") // disables the deal button
    hitButton.toggleAttribute("disabled") // Enables the hit and stand button 
    standButton.toggleAttribute("disabled")
    // Updates everyone's totals and hides the dealer's total
    updateTotal("player")
    dealerPointsDOM.toggleAttribute("hidden")
    updateTotal("dealer")
});

// Hit functionality 
hitButton.addEventListener("click", () => {
    dealTopCardTo("player")
    updateTotal("player")
})

// Stand functionality. Just ends the game with the stand condition 
standButton.addEventListener("click",() => {
    endGameStand()
})

// A whole function to handle Aces? better believe it. 
const SumAndHandleAces = (inputArray,inputSum) => {
    for (cardValue of inputArray){
        if (cardValue == 1 && inputSum <= 11){ // For aces, if the total won't bust if the ace counts as 11. 
            inputSum += 10 
        }
    }
    return [inputSum] // returns the new sum 
}

// Updates the total card value of either the player or dealer. Checks if the player busts. 
let dealerTotal = 0;
let playerTotal = 0;
let playerValueArray = [];
let dealerValueArray = [];
const updateTotal = (playerOrDealer) => {
    if (playerOrDealer == "player"){
        playerTotal = 0; // just resets everything every time to be safe 
        playerValueArray = [];
        for (dealtCard of playerHand){
            playerValueArray.push(dealtCard.rank)
            playerTotal = playerValueArray.reduce((a, b) => a + b, 0) // sums the array 
            playerTotal = SumAndHandleAces(playerValueArray,playerTotal) // Handles Aces 
        }
        playerPointsDOM.innerText = playerTotal
        if (playerTotal > 21) {endGameBust("playerBust")}
    } else { // does the same as above, but for the dealer 
        dealerTotal = 0;
        dealerValueArray = [];
        for (dealtCard of dealerHand){
            dealerValueArray.push(dealtCard.rank)
            dealerTotal = dealerValueArray.reduce((a, b) => a + b, 0)
            dealerTotal = SumAndHandleAces(dealerValueArray,dealerTotal)
        }
        dealerPointsDOM.innerText = dealerTotal
        if (dealerTotal > 21) {endGameBust("dealerBust")}
    }
}

// Function which ends the game by bust 
const endGameBust = (playerOrDealer) => {
    flipFirstDealerCard() // flips the first dealer's card 
    dealerPointsDOM.toggleAttribute("hidden") // unhides the dealer total 
    hitButton.toggleAttribute("disabled") // disables the hit and stand buttons 
    standButton.toggleAttribute("disabled") 
    if (playerOrDealer == "playerBust"){
        winnerIs("dealer")
    } else { // this must mean it's a dealer bust 
        winnerIs("player")
    } 
}  

// Function which ends the game by stand     
const endGameStand = () => {
    while (dealerTotal < 17){
        dealTopCardTo("dealer")
        updateTotal("dealer")
    }
    if ((dealerTotal < 22) && (playerTotal < 22)){
        // If we're here, that means no one has bust and the dealer has 17 or higher. 
        // This means we have to end the game properly and compare totals. 
        flipFirstDealerCard() // flips the first dealer's card 
        dealerPointsDOM.toggleAttribute("hidden") // unhides the dealer total 
        hitButton.toggleAttribute("disabled") // disables the hit and stand buttons 
        standButton.toggleAttribute("disabled") 
        if (playerTotal > dealerTotal){
            winnerIs("player")
        } else { // dealer wins ties 
            winnerIs("dealer")
        }
    }
}

// Player winning function 
const winnerIs = (playerOrDealer) => {
    if (playerOrDealer == "player"){
        messageBox.innerText = "You won!"
        // increases and updates local storage 
        localStorage.playerWins = parseInt(localStorage.playerWins) + 1
        playerWinsDOM.innerText = localStorage.playerWins; 
    }
    else {
        messageBox.innerText = "You lost."
        localStorage.dealerWins = parseInt(localStorage.dealerWins) + 1
        dealerWinsDOM.innerText = localStorage.dealerWins; 
    }
    playAgainButton.toggleAttribute("disabled") // Enables the play again button 
}

// Play again button functionality 
playAgainButton.addEventListener("click", () => {location.reload()})

// Stretch goals: ===========================================================
// Track games won ----------------

// get variables 
const dealerWinsDOM = document.getElementById("dealer-wins");
const playerWinsDOM = document.getElementById("player-wins");

// player and dealer wins are grabbed from local storage when the page loads. 
playerWinsDOM.innerText = localStorage.playerWins; 
dealerWinsDOM.innerText = localStorage.dealerWins;

// betting feature 
// playing with multiple decks