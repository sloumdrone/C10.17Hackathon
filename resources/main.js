$(document).ready(initialize)

function initialize(){
  var game = new GameModel();
  var view = new View(game);
  var controller = new Controller(game);
  game.setController(controller);
  game.setView(view);
  view.setController(controller);
  controller.setView(view);
  addClickHandlers(game, view);
}

function addClickHandlers(game, view, player){
    $('.playerAvatar').click(function(){
      if (game.clickable){
        var characterSelection = $(event.target).attr('id');
        game.addPlayer(characterSelection);
        // view.addOutlineToSelectedPlayer();
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
  var controller = null;
  this.setController = function(control){
      controller = control;
      delete this.setController;
  }
  var view = null;
  this.setView = function(viewer){
      view = viewer;
      delete this.setView;
  }

  this.checkWinState = function(){
    if (this.players['1']['hitPoints'] <= 0 || this.players['2']['hitPoints'] <= 0){
      this.clickable = false;
      this.gameState = 'endgame';
      view.showEndgameWinner();
    }
  }

  this.availableCharacters = {
    'superman' : {
      name: 'Superman',
      img: 'superman.png',
      category: 'General Knowledge',
      categoryID: '9'
    },
    'libertybelle' : {
      name: 'Liberty Belle',
      img: 'liberty-belle.png',
      category: 'Math',
      categoryID: '19'
    },
    'thething' : {
      name: 'The Thing',
      img: 'thing.png',
      category: 'Computers',
      categoryID: '18'
    },
    'mrfantastic' : {
      name: 'Mr. Fantastic',
      img: 'mr-fantastic.png',
      category: 'Computers',
      categoryID: '18'
    },
    'batman' : {
      name: 'Batman',
      img: 'batman.png',
      category: 'Gadgets',
      categoryID: '9'
    },
    'ironman' : {
      name: 'Iron Man',
      img: 'iron-man.png',
      category: 'Vehicles',
      categoryID: '28'
    },
    'thor' : {
      name: 'Thor',
      img: 'thor.png',
      category: 'Mythology',
      categoryID: '20'
    },
    'nightcrawler' : {
      name: 'Nightcrawler',
      img: 'nightcrawler.png',
      category: 'Video Games',
      categoryID: '15'
    },
    'wolverine' : {
      name: 'Wolverine',
      img: 'wolverine.png',
      category: 'Animals',
      categoryID: '27'
    },
    'juggernaut' : {
      name: 'Juggernaut',
      img: 'juggernaut.png',
      category: 'Sports',
      categoryID: '21'
    },
    'mrsinister' : {
      name: 'Mr. Sinister',
      img: 'mr-sinister.png',
      category: 'History',
      categoryID: '23'
    },
    'robin' : {
      name: 'Robin',
      img: 'robin.png',
      category: 'Comics',
      categoryID: '29'
    }
  }

  this.addPlayer = function(character){
    //take selection from player select screen and add that character for that player
    this.players[this.turn] = new Player(character, this);
    if (this.turn === 1){
      this.turn = 2;
    } else {
      this.gameState = 'loading';
      this.clickable = false;
      //display loading screen
      //gather trivia questions based on characters
      //when done, load function will trigger ready state
    }
  }
}


function Player(characterSelection, game){
  this.hitPoints = 100; //we can do whatever here. 100 is just a starting point.
  this.character = game.availableCharacters[characterSelection];
  this.trivia = {}; //object of arrays of objects

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

    var controller = null;
    this.setController = function(control){
        controller = control;
        delete this.setController;
    }
  //
  // this.addOutlineToSelectedPlayer = function(){
  //     $(this).addClass('playerAvatarClicked');
  //     console.log(this);
  // }

}


function Controller(model){
  this.dealDamage = function(amount){
    model.turn === 1
    ? model.players[model.turn + 1]['hitPoints'] -= amount
    : model.players[model.turn - 1]['hitPoints'] -= amount;
  }

    var view = null;
    this.setView = function(viewer){
        view = viewer;
        delete this.setView;
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

  this.retrieveQuestions = function(diff,categoryID,player){
    console.log('recieve questions');
      $.ajax({
          method: 'GET',
          dataType: 'JSON',
          data:{
              'amount': 10,
              category: categoryID,
              difficulty: diff,
              type: 'multiple',
              token: model.token
          },
          url: 'https://opentdb.com/api.php',
          success: function(data){
             if(data.response_code===0){
                 model.players[player]['questions'][diff] = data.results;
                 console.log('finished ' + player + ' ' + diff);
             } else {
               alert('Issue with question retrieval. Response code: ' + data.responsecode);
             }
          },
          error: function(){
              console.log('error input')
          }
      });
  }

  this.buildQuestionShoe = function(){
    console.log('build shoe');
    var difficulty = ['easy','medium','hard'];
    for (player in model.players){
      difficulty.forEach((element)=>{
        this.retrieveQuestions(element,model.players[player]['categoryID'],player);
      });
    }

  }

}
