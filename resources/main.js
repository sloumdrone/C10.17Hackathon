$(document).ready(initialize);

function initialize(){
  var game = new GameModel();
  var view = new View(game);
  var controller = new Controller(game);
  addClickHandlers();
}

function addClickHandlers(){
    $('.playerAvatar').click(function(){
      if (game.clickable){
        var characterSelection = $(event.target).attr('id');
        game.addCharacter(game.availableCharacters[characterSelection]);
      }
    });
}


function GameModel(){
  this.gameState = 'playerSelection'; //playerSelection, loading, trivia, ready, endgame
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
    if (this.players['1']['hitPoints'] <= 0 || this.players['2']['hitPoints'] <= 0){
      this.clickable = false;
      this.gameState = 'endgame';
      view.showEndgameWinner();
    }
  }



  this.availableCharacters = {
    'superman' : {name: 'Superman', img: 'superman.png', category: ''},
    'libertybelle' : {name: 'Liberty Belle', img: 'liberty-belle.png', category: ''},
    'thething' : {name: 'The Thing', img: 'thing.png', category: ''},
    'mrfantastic' : {name: 'Mr. Fantastic', img: 'mr-fantastic.png', category: ''},
    'batman' : {name: 'Batman', img: 'batman.png', category: ''},
    'ironman' : {name: 'Iron Man', img: 'iron-man.png', category: ''},
    'thor' : {name: 'Thor', img: 'thor.png', category: ''},
    'nightcrawler' : {name: 'Nightcrawler', img: 'nightcrawler.png', category: ''},
    'wolverine' : {name: 'Wolverine', img: 'wolverine.png', category: ''},
    'juggernaut' : {name: 'Juggernaut', img: 'juggernaut.png', category: ''},
    'mrsinister' : {name: 'Mr. Sinister', img: 'mr-sinister.png', category: ''},
    'robin' : {name: 'Robin', img: 'robin.png', category: ''}
  }

  this.addPlayer = function(character){
    //take selection from player select screen and add that character for that player
    this.players[this.turn] = new Player(character);
    if (this.turn === 1){
      this.turn = 2;
    } else {
      this.gameState = 'loading';
      this.clickable = false;
      //display loading screen
      //gather trivia questions based on characters
      //when done, load funciton will trigger ready state
    }
  }
}


function Player(characterSelection){
  this.hitPoints = 100; //we can do whatever here. 100 is just a starting point.
  this.character = game.availableCharacters[characterSelection];
  this.trivia = {} //object of arrays of objects

  this.getWinQuote = function(characterName){
    //calls chuck norris api
    //replaces chuck norris with character characterName
    //returns info
  }
}



function View(model){
  //all of our functions for updating the view will go here
    this.showEndgameWinner = function(){
    var winner;
    if (model.players['1']['hitPoints'] > 0){
      winner = model.players['1']['name'];
    } else {
      winner = model.players['2']['name'];
    }

    //wait a few seconds
    //add the win quote for the character to the win modal
    //show the win modal

  }
}


function controller(model){
  this.dealDamage = function(amount){
    model.turn === 1
    ? model.players[model.turn + 1]['hitPoints'] -= amount
    : model.players[model.turn - 1]['hitPoints'] -= amount;
  }

  this.getSessionToken = function(){
      $.ajax({
          method: 'GET',
          dataType: 'JSON',
          url: 'https://opentdb.com/api_token.php',
          data: {
            command: 'request'
          },
          success: function(data){
             if(data.response_code ===0 ){
                model.token = data.token;
             }else{
                 console.error('server response'+ data.response_code +" "+data.response_message);
             }
          },
          error: function(){
              console.log('error input');
          }
      });
  }

}
