



function GameModel(){
  this.gameState = 'menu'; //menu, loading, trivia, ready, endgame
  this.clickable = true;
  this.turn = 1;
  this.roundTime = 60; //just a starting number, tracks amount of time left in round;
  this.questionsLeft = 10; //tracks the number of
  this.players = {
    //1 : Player {}
    //2 : Player {}
    //built using the add
  }



  this.checkWinState = function(){
    //check win state
  }


}


function Player(characterSelection){
  this.hitPoints = 100; //we can do whatever here. 100 is just a starting point.
  this.character = characterSelection; //this will be an object holding a number of items
  this.trivia = {} //object of arrays of objects

  this.getWinQuote = function(characterName){
    //calls chuck norris api
    //replaces chuck norris with character characterName
    //returns info
  }
}



function View(model){
  //all of our functions for updating the view will go here
}


function controller(model){
  this.dealDamage = function(amount){
    model.turn === 1
    ? model.players[model.turn + 1]['hitPoints'] -= amount
    : model.players[model.turn - 1]['hitPoints'] -= amount;
  }

  this.addPlayer = function(character){
    //take selection from player select screen and add that character for that player
    model.players[model.turn] = new Player(character);
    if (model.turn === 1){
      model.turn = 2;
    } else {
      model.gameState = 'loading';
      model.clickable = false;
      //display loading screen
      //gather trivia questions based on characters
      //when done, load funciton will trigger ready state
    }
  }
}
