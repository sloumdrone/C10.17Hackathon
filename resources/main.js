

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
    view.handleAvatarHover();
}

function addClickHandlers(game, view, player, controller){
    $('.playerAvatar').click(function(){
        if (game.avatarClickable){
            console.log(game.turn);
            var characterSelection = $(event.target).attr('id');
            game.addPlayer(characterSelection);
            view.addOutlineToSelectedPlayer();
        }
    });
}


function GameModel(){
    this.gameState = 'playerSelection'; //playerSelection, loading, trivia, ready, endgame
    this.avatarClickable = true;
    this.playButtonClickable = false;
    this.bothPlayersSelected = false;
    this.turn = 1;
    this.roundTime = 60; //just a starting number, tracks amount of time left in round;
    this.questionsLeft = 10; //tracks the number of questions asked
    this.questions = {};
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
            this.avatarClickable = false;
            view.activePlayButton();
            this.bothPlayersSelected = true;
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

    this.showEndgameWinner = function() {
        var winner;
        var winnerImg;

        if (model.players['1']['hitPoints'] > 0) {
            // winner = model.players['1']['name'];
            winner = model.players['1']['character']['name'];
            winnerImg = model.players['1']['character']['img']
        } else {
            // winner = model.players['2']['name'];
            winner = model.players['2']['character']['name'];
            winnerImg = model.players['2']['character']['img']
        }
        controller.getQuote(winner, winnerImg);
        setTimeout(function () {

            $('.gameBoard').hide();
            $('.winnerModal').show();

        }, 3000)
        //wait a few seconds
        //add the win quote for the character to the win modal
        //show the win modal
    }

    var controller = null;
    this.setController = function(control){
        controller = control;
        delete this.setController;
    }

    this.addOutlineToSelectedPlayer = function(){
        $(event.target).addClass('playerAvatarClicked');
    }

    this.activePlayButton = function(){
        model.playButtonClickable = true;
        $('.playButton').click(function(){
            if(model.playButtonClickable) {
                console.log('start game');
                // add function that triggers game start/load screen
                model.playButtonClickable = false;
            }
        })
    }

    this.handleAvatarHover = function (){
            $('.playerAvatar').hover(function () {
                if (model.bothPlayersSelected === false) {
                    var characterImg = $(event.target).attr('id');
                    console.log(characterImg);
                    if (model.turn === 1) {
                        $('.playerContainerLeft').addClass('playerPhotoLeft').css('background-image', "url('resources/images/characters/" + model.availableCharacters[characterImg].img + "')");
                    } else {
                        $('.playerContainerRight').addClass('playerPhotoRight').css('background-image', "url('resources/images/characters/" + model.availableCharacters[characterImg].img + "')");
                    }
                }
            }, function () {
                if (model.turn === 1) {
                    $('.playerContainerLeft').removeClass('playerPhotoLeft');
                } else {
                    $('.playerContainerRight').removeClass('playerPhotoRight');
                }
            });
        }


}


function Controller(model,view) {
    this.dealDamage = function (amount) {
        model.turn === 1  //condition
            ? model.players[model.turn + 1]['hitPoints'] -= amount  //do if true
            : model.players[model.turn - 1]['hitPoints'] -= amount;  //do if false
    }

    var view = null;
    this.setView = function (viewer) {
        view = viewer;
        delete this.setView;
    }


    this.getSessionToken = function () {
        $.ajax({
            method: 'GET',
            dataType: 'JSON',
            url: 'https://opentdb.com/api_token.php',
            data: {
                command: 'request'
            },
            success: function (data) {
                if (data.response_code === 0) {
                    model.token = data.token;
                } else {
                    console.error('server response' + data.response_code + " " + data.response_message);
                }
            },
            error: function () {
                console.log('error input');
            }
        });

    }

    this.checkWinState = function() {
        if (model.players['1']['hitPoints'] <= 0 || model.players['2']['hitPoints'] <= 0) {
            model.clickable = false;
            model.gameState = 'endgame';
            view.showEndgameWinner();
        }
    }

    this.retrieveQuestions = function(diff){
        $.ajax({
            method: 'GET',
            dataType: 'JSON',
            data:{
                'amount': 50,
                difficulty: diff,
                type: 'multiple',
                token: model.token
            },
            url: 'https://opentdb.com/api.php',
            success: function(data){
                if(data.response_code===0){
                    model.questions[diff] = data.results;
                    console.log('finished ' + diff);
                } else {
                    alert('Issue with question retrieval. Response code: ' + data.response_code);
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

        difficulty.forEach((element)=>{
            this.retrieveQuestions(element);
        });
    }


  this.getQuote = function(winner, winnerImg){
    $.ajax({
        method: 'get',
        url: 'https://api.chucknorris.io/jokes/random',
        dataType: 'json',
        success: function(quote){
            console.log('original', quote.value);
          var regEx = new RegExp('chuck norris', 'ig');
          var chuckNorrisQuote = quote.value;
          var winnerQuote = chuckNorrisQuote.replace(regEx, winner);
          $('.chuckNorrisQuote p').text(winnerQuote);

          $('.winningCharacter').css('background-image', 'url("resources/images/characters/'+winnerImg+'")')
          console.log('winnerQuote',winnerQuote);
          return winnerQuote;
        },
        error: function(){
          console.log('something went wrong!')
        }
    });
  }







}
