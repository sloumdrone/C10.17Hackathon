

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
    controller.buildQuestionShoe();
}

function addClickHandlers(game, view, player){
    $('.playerAvatar').click(function(){
        if (game.avatarClickable){
            console.log(game.turn);
            var characterSelection = $(event.target).attr('id');
            game.addPlayer(characterSelection);
            view.addOutlineToSelectedPlayer();
        }
    });
    $('.questionModal').on('click', '.answer', function(){
        controller.selectAnswer(this)
    })
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

    this.showEndgameWinner = function(){
        var winner;
        if (model.players['1']['hitPoints'] > 0){
            winner = model.players['1']['name'];
        } else {
            winner = model.players['2']['name'];
        }

        setTimeout(function(){
            $('.chuckNorrisQuote p').text(controller.getQuote(winner));
            $('.winnerModal').show();
        }, 3000)
        //wait a few seconds
        //add the win quote for the character to the win modal
        //show the win modal
    }
    var controller=null;
    this.setController = function(control){
        controller = control;
        delete this.setController;
    }
    this.renderQuestion = function(questions){ //renders Question and answers into Arena
        var qArray = questions;
        var entry = questions.shift(0);
        var category = entry.category;
        var question = controller.domParser(entry.question);//parses html entities from api string
        var ansList = entry.incorrect_answers; //array of incorrect answers
        var correctAns = entry.correct_answer;
        var randomNum = Math.floor(Math.random()*4);
        ansList.splice(randomNum,0, correctAns);
        game.questionsLeft--;
        var catSpan = $('<span>',{
            text: category,
            'class': 'category'
        })
        $('.questionContainer p').text(question).append(catSpan);
        for(var ans_i=0;ans_i<ansList.length;ans_i++){
            this.createAnsDiv(ans_i, correctAns, ansList[ans_i], category);
        }
    }
    this.createAnsDiv=function(num, answer, text){
        var ansDiv= $('<div>',{
            id: 'q'+num,
            'class': 'answer',
            text: controller.domParser(text)
        });
        ansDiv[0].category = category;
        if(text!==answer){ //stores correct and incorrect properties inside the DOM element
            ansDiv[0].answer= 'incorrect';
        }else{
            ansDiv[0].answer = 'correct'
        }
        $('.questionModal').append(ansDiv)
    }
    this.renderDmg = function(amount){
        var percent = amount/100;//get percent equivalent of the dmg
        var hpBar=null;
        var remainingHp=null;
        var dmg=null;
        if(model.turn === 1){
            hpBar = $('.right');

        }else{
            hpBar = $('.left')
        }
        remainingHp = hpBar.css('width')
        if(remainingHp-amount<0){
            dmg=0;
        }else{
            dmg=remainingHp-amount
        }
        hpBar.css('width', dmg+"%") //reduces the width by the percentage of the dmg.
    }

  //
  // this.addOutlineToSelectedPlayer = function(){
  //     $(this).addClass('playerAvatarClicked');
  //     console.log(this);
  // }

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


function Controller(model,view){


  this.dealDamage = function(amount){
    model.turn === 1
    ? model.players[model.turn + 1]['hitPoints'] -= amount
    : model.players[model.turn - 1]['hitPoints'] -= amount;
    view.renderDmg(amount);
  }
  this.dmgCalculator = function(difficulty, boolean){
      var damagePercent = 0;
      if(boolean){
          damagePercent+=5;
      }
      switch (difficulty){
          case 'easy':
              damagePercent+=4;
              break;
          case 'medium':
              damagePercent+=8;
              break;
          case 'hard':
              damagePercent+=12;
              break;
      }
      return damagePercent
  }

    var view = null;
    this.setView = function (viewer) {
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

  this.checkWinState = function() {
      if (model.players['1']['hitPoints'] <= 0 || model.players['2']['hitPoints'] <= 0) {
          model.clickable = false;
          model.gameState = 'endgame';
          view.showEndgameWinner();
      } else {
          if (model.turn === 1) {
              model.turn += 1;
          } else {
              model.turn -= 1;
          }
      }
  }


      this.checkWinState = function () {
          if (model.players['1']['hitPoints'] <= 0 || model.players['2']['hitPoints'] <= 0) {
              model.avatarClickable = false;
              model.gameState = 'endgame';
              view.showEndgameWinner();
          }
      }

      this.retrieveQuestions = function (diff) {
          $.ajax({
              method: 'GET',
              dataType: 'JSON',
              data: {
                  'amount': 50,
                  difficulty: diff,
                  type: 'multiple',
                  token: model.token
              },
              url: 'https://opentdb.com/api.php',
              success: function (data) {
                  if (data.response_code === 0) {
                      model.questions[diff] = data.results;
                      console.log('finished ' + diff);
                  } else {
                      alert('Issue with question retrieval. Response code: ' + data.response_code);
                  }
              },
              error: function () {
                  console.log('error input')
              }
          });
      }

      this.buildQuestionShoe = function () {
          console.log('build shoe');
          var difficulty = ['easy', 'medium', 'hard'];

          difficulty.forEach((element) => {
              this.retrieveQuestions(element);
          });

      }

      this.getQuote = function (winner) {
          $.ajax({
              method: 'get',
              url: 'https://api.chucknorris.io/jokes/random',
              dataType: 'json',
              success: function (quote) {
                  var regEx = new RegExp('chuck norris', 'ig');
                  var chuckNorrisQuote = quote.value;

                  var winnerQuote = chuckNorrisQuote.replace(regEx, winner);

                  console.log(winnerQuote);
                  return winnerQuote;
              },
              error: function () {
                  console.log('something went wrong!')
              }
          });
      }
      this.selectAnswer = function (element, difficulty) {
          var specialty = false;
          if (element.answer === 'correct') {
              if (element.category === model.player[mode.turn].character.category) {
                  specialty = true;
                  this.dealDamage(this.dmgCalculator(difficulty, specialty))
              }
          }
          this.checkWinState();
      }
      this.domParser = function (input) {
          var doc = new DOMParser().parseFromString(input, "text/html");
          return doc.documentElement.textContent;
      }

}
