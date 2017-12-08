$(document).ready(initialize);

var game;
function initialize(){
    game = new GameModel();
    game.controller.getSessionToken();
    addClickHandlers();
    game.view.handleAvatarHover();
    game.controller.buildCharacterInfo();
    $('.gameBoard').css('background-image','url("./resources/images/backgrounds/' + game.gameBoardBackgrounds[Math.floor(Math.random()*game.gameBoardBackgrounds.length)] + '")');
    console.log('Round timer: ' + game.roundTimer,'round time: ' + game.roundTime, 'HTML timer text:' + $('.timer').text());
}


function addClickHandlers(){
    $('.playerAvatar').click(function(){
        if (game.avatarClickable){
            if (game.turn === 1){
              $('.playerContainerLeft').css({'animation': 'spinner 6s infinite',
              'animation-timing-function': 'linear'});
            } else {
              $('.playerContainerRight').css({'animation': 'spinner 6s infinite',
              'animation-timing-function': 'linear'})
            }
            var characterSelection = $(event.target).attr('id');
            game.addPlayer(characterSelection);
            game.view.addOutlineToSelectedPlayer();
        }
    });

    $('.questionModal').on('click', '.answer', function(){
        game.controller.selectAnswer(this);
    });

    $('.playAgain').click(function(){
        game.controller.newGame();
        $('.loadScreen').hide();
        $('.modalContainer').fadeIn(2000);
    });

    $('.readyButton').on('click',function(){
        clearInterval(game.roundTimer);
        game.controller.questionBank(game.questions);
        game.roundTime=60;
        game.view.renderTimer();
        $('.readyBanner').fadeOut();
        $('.questionModal').addClass('questionModalShow');
    });
}


function GameModel(){
    this.view = new View();
    this.controller = new Controller();
    // this.gameState = this.states.gameStart; //playerSelection, trivia, ready, endgame
    this.token = null;
    this.avatarClickable = true;
    this.playButtonClickable = false;
    this.bothPlayersSelected = false;
    this.turn = 1;
    this.roundTime = 60; //just a starting number, tracks amount of time left in round;
    // // this.questionsLeft = 10; //tracks the number of questions asked
    this.roundTimer = null;
    this.apiResponse = 0;
    this.questions = {};
    this.players = {
        //1 : Player {}
        //2 : Player {}
        //built using the add
    };

    this.availableCharacters = {
        'deadpool' : {
            name: 'Deadpool',
            img: 'deadpool.png',
            category: 'General Knowledge',
            categoryID: '9',
            heroID: '213'
        },
        'magneto' : {
            name: 'Magneto',
            img: 'magneto.png',
            category: "Science: Computers",
            categoryID: '19',
            heroID: '423'
        },
        'thething' : {
            name: 'The Thing',
            img: 'the-thing.png',
            category: "Science & Nature",
            categoryID: '18',
            heroID: '658'
        },
        'captainamerica' : {
            name: 'Captain America',
            img: 'captain-america.png',
            category: "History",
            categoryID: '18',
            heroID: '149'
        },
        'batman' : {
            name: 'Batman',
            img: 'batman.png',
            category: "Science: Gadgets",
            categoryID: '9',
            heroID: '70'
        },
        'ironman' : {
            name: 'Iron Man',
            img: 'iron-man.png',
            category: 'Vehicles',
            categoryID: '28',
            heroID: '346'
        },
        'thor' : {
            name: 'Thor',
            img: 'thor.png',
            category: 'Mythology',
            categoryID: '20',
            heroID: '659'
        },
        'domino' : {
            name: 'Domino',
            img: 'domino.png',
            category: "Entertainment: Video Games",
            categoryID: '15',
            heroID: '227'
        },
        'wonderwoman' : {
            name: 'Wonder Woman',
            img: 'wonder-woman.png',
            category: "Art",
            categoryID: '27',
            heroID: '720'
        },
        'mystique' : {
            name: 'Mystique',
            img: 'mystique.png',
            category: 'Sports',
            categoryID: '21',
            heroID: '480'
        },
        'scarletwitch' : {
            name: 'Scarlet Witch',
            img: 'scarlet-witch.png',
            category: "Science & Nature",
            categoryID: '23',
            heroID: '579'
        },
        'superman' : {
            name: 'Superman',
            img: 'superman.png',
            category: "Entertainment: Comics",
            categoryID: '29',
            heroID: '644'
        }
    };

    this.gameBoardBackgrounds = [
      'airport.gif',
      'backalley.gif',
      'castle-ruins.gif',
      'jungle-temple.gif',
      'mansion.gif',
      'over-pass.gif',
      'ruins.gif',
      'ship.gif',
      'shipinterior.gif',
      'water-fall.gif',
      'wood-ruins.gif'
    ];

    this.addPlayer = function(character){
        //take selection from player select screen and add that character for that player
        this.players[this.turn] = new Player(character, this);
        if (this.turn === 1){
            this.turn = 2;
        } else {
            this.avatarClickable = false;
            game.view.activePlayButton();
            this.bothPlayersSelected = true;
        }
    }
}

function Player(characterSelection, game){
    this.hitPoints = 100; //we can do whatever here. 100 is just a starting point.
    this.character = game.availableCharacters[characterSelection];

}

function View(){
  //all of our functions for updating the view will go here

    this.showEndgameWinner = function() {
        clearInterval(game.roundTimer);
        $('.readyButton span').text('P1');
        var winner;
        var winnerImg;

        if (game.players['1']['hitPoints'] > 0) {
            // winner = game.players['1']['name'];
            winner = game.players['1']['character']['name'];
            winnerImg = game.players['1']['character']['img']
            winnerSex = game.players[1]['character']['characterInfo']['appearance']['gender'];
        } else {
            // winner = game.players['2']['name'];
            winner = game.players['2']['character']['name'];
            winnerImg = game.players['2']['character']['img']
            winnerSex = game.players[2]['character']['characterInfo']['appearance']['gender'];
        }

        game.controller.getQuote(winner, winnerImg, winnerSex);

        $('.gameBoard').fadeOut(1500);
        $('.winnerModal').fadeIn(1500);

    };

    this.renderQuestion = function(qArray){ //renders Question and answers into Arena
        $('.answer').remove();
        if(game.questionBank.length===0){
            $('.questionModal').removeClass('questionModalShow');
            clearInterval(game.roundTimer);
            //wincheckstate & player change
            if(game.turn===1){
                $('.readyButton span').text('P2')
            }else{
                $('.readyButton span').text('P1')
            }
            game.controller.checkWinState();
            return;
        }
        var entry = qArray.shift();
        var difficulty = entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1);
        var question = game.controller.domParser(entry.question);//parses html entities from api string
        var ansList = entry.incorrect_answers; //array of incorrect answers
        var correctAns = entry.correct_answer;
        var randomNum = Math.floor(Math.random()*4);
        ansList.splice(randomNum,0, correctAns);
        // game.questionsLeft--;
        var catSpan = $('<span>',{
            text: difficulty +": "+ entry.category,
            'class': 'category'
        });
        $('.questionContainer p').text(question).append(catSpan);
        for(var ans_i=0;ans_i<ansList.length;ans_i++){
            this.createAnsDiv(ans_i,ansList[ans_i], entry);
        }
    };

    this.createAnsDiv=function(num,text, entry){
        var ansDiv= $('<div>',{
            id: 'q'+num,
            'class': 'answer',
            text: game.controller.domParser(text)
        });
        ansDiv[0].difficulty = entry.difficulty;
        ansDiv[0].category = entry.category;
        if(text!==entry.correct_answer){ //stores correct and incorrect properties inside the DOM element
            ansDiv[0].answer= 'incorrect';
        }else{
            ansDiv[0].answer = 'correct'
        }
        $('.questionModal').append(ansDiv)
    };

    this.renderDmg = function(amount){
        if(game.turn === 1){
            currentHpBar = $('.right');

        }else{
            currentHpBar = $('.left');
        }
        currentHpBar.css('width', amount+"%") //reduces the width by the percentage of the dmg.
    };

    this.addOutlineToSelectedPlayer = function(){
        $(event.target).addClass('playerAvatarClicked');
    };

    this.activePlayButton = function(){

        game.playButtonClickable = true;
        $('.playButton').click(function(){
            if(game.playButtonClickable) {
              game.playButtonClickable = false;
              game.avatarClickable = false;
              game.turn = 1;


              $('.modalContainer').hide();
              $('#p1name').text(game.players[1].character.name);
              $('#p2name').text(game.players[2].character.name);
              $('.gameBoard').show();
              $('.readyBanner').show('slow');

              // add function that triggers game start/load screen
            }
        });
        this.renderHeroInArena(game.players);
    };

    this.handleAvatarHover = function (){
        $('.playerAvatar').hover(function () {
            if (game.bothPlayersSelected === false) {
                var characterImg = $(event.target).attr('id');
                if (game.turn === 1) {
                    $('.playerContainerLeft').css('background-image', "url('resources/images/characters/" + game.availableCharacters[characterImg].img + "')");
                    $('.characterNameLeft').text(game.availableCharacters[characterImg].name);
                    $('.infoHeaderName').text('Real Name: ');
                    $('#realNameLeft').text(game.availableCharacters[characterImg].characterInfo.biography['full-name']);
                    $('.infoHeaderPower').text('Power: ');
                    $('#categoryIDLeft').text(game.availableCharacters[characterImg].category);
                    $('.infoHeaderOccupation').text('Occupation: ');
                    $('#occupationLeft').text(game.availableCharacters[characterImg].characterInfo.work.occupation.split(',')[0]);
                } else {
                    $('.playerContainerRight').css('background-image', "url('resources/images/characters/" + game.availableCharacters[characterImg].img + "')");
                    $('.characterNameRight').text(game.availableCharacters[characterImg].name);
                    $('.infoHeaderNameRight').text('Real Name: ');
                    $('#realNameRight').text(game.availableCharacters[characterImg].characterInfo.biography['full-name']);
                    $('.infoHeaderPowerRight').text('Power: ');
                    $('#categoryIDRight').text(game.availableCharacters[characterImg].category);
                    $('.infoHeaderOccupationRight').text('Occupation: ');
                    $('#occupationRight').text(game.availableCharacters[characterImg].characterInfo.work.occupation.split(',')[0]);
                }
            }
        }, function () {
            if (game.turn === 1) {
                $('.playerContainerLeft').removeClass('playerPhotoLeft');
            } else {
                $('.playerContainerRight').removeClass('playerPhotoRight');
            }
        });
    };

    this.renderHeroInArena = function(players){   //renders each players img to main game board arena
        $('.player1').css('background-image', 'url("resources/images/characters/'+ players[1].character.img+'")');
        $('.player2').css('background-image', 'url("resources/images/characters/'+ players[2].character.img+'")');
    };

    this.renderTimer = function(){   // renders the timer for each player
        game.roundTimer  = setInterval(function() {
            game.roundTime--;
            $('.currentTime').text(game.roundTime);
            if(game.roundTime===0){
                $('.questionModal').removeClass('questionModalShow');
                clearInterval(game.roundTimer);
                if(game.turn===1){
                    game.turn=2;
                    $('.readyButton span').text('P2')
                }else{
                    game.turn=1;
                    $('.readyButton span').text('P1')
                }
                $('.readyBanner').show();
                }
            }, 1000);
    }

}


function Controller(){

    this.questionBank = function(questionsObj){
        var qBank = [];
        for(key in questionsObj){
            // for(var main_i = 0;main_i<questionsArrMain.length;main_i++){
                var maxQ = 3;
                if(key==='easy'){
                    maxQ=4
                }
                for(var sub_i=0;sub_i<maxQ;sub_i++){
                    var qEntry = questionsObj[key].shift();
                    var qA = {
                        question: qEntry.question,
                        category: qEntry.category,
                        difficulty: qEntry.difficulty,
                        correct_answer: qEntry.correct_answer,
                        incorrect_answers: [qEntry.incorrect_answers[0],qEntry.incorrect_answers[1],qEntry.incorrect_answers[2]]
                    };
                    qBank.push(qA)
                }
            }
        game.questionBank = qBank;
        game.view.renderQuestion(game.questionBank);

    };


  this.dealDamage = function(amount){
    game.turn === 1
    ? game.players[game.turn + 1]['hitPoints'] -= amount
    : game.players[game.turn - 1]['hitPoints'] -= amount;
    var hpTarget= null;
    if(game.turn===1){
        hpTarget = game.players[2]['hitPoints']
    }else{
        hpTarget = game.players[1]['hitPoints']
    }
    game.view.renderDmg(hpTarget);
    if(game.questionBank===0 || game.players['1']['hitPoints']<=0 ||  game.players['2']['hitPoints']<=0){
        this.checkWinState();
    }

  };

  this.dmgCalculator = function(difficulty, boolean){
      var damagePercent = 0;
      if(boolean){
          damagePercent+=7;
      }
      switch (difficulty){
          case 'easy':
              damagePercent+=10;
              break;
          case 'medium':
              damagePercent+=15;
              break;
          case 'hard':
              damagePercent+=20;
              break;
      }
      return damagePercent
  };

  this.getSessionToken = function(){  //avoids receiving same question w/in 6 hour period
      $.ajax({
          method: 'GET',
          dataType: 'JSON',
          url: 'https://opentdb.com/api_token.php',
          data: {
            command: 'request'
          },
          success: function(data){
             if(data.response_code ===0 ){
                game.token = data.token;
                game.controller.buildQuestionShoe();
             }else{
                 console.error('server response'+ data.response_code +" "+data.response_message);
             }
          },
          error: function(){
              console.warn('error input');
          }
      });
  };

  this.checkWinState = function() {

      if (game.players['1']['hitPoints'] <= 0 || game.players['2']['hitPoints'] <= 0) {
          game.gameState = 'endgame';
          game.view.showEndgameWinner();
      }else{
          if (game.turn === 1) {
              game.turn += 1;
          } else {
              game.turn -= 1;
          }
          $('.readyBanner').slideDown('slow');
          this.questionBank(game.questions)
      }

  };

      this.retrieveQuestions = function (diff) {
          $.ajax({
              method: 'GET',
              dataType: 'JSON',
              data: {
                  'amount': 50,
                  difficulty: diff,
                  type: 'multiple',
                  token: game.token
              },
              url: 'https://opentdb.com/api.php',
              success: function (data) {
                  if (data.response_code === 0) {
                      game.questions[diff] = data.results;
                  } else {
                      alert('Issue with question retrieval. Response code: ' + data.response_code);
                  }
              },
              error: function () {
                  console.warn('error input');
              }
          });
      };
      this.buildQuestionShoe = function () {
          var difficulty = ['easy', 'medium', 'hard'];

          difficulty.forEach((element) => {
              this.retrieveQuestions(element);
          });

      };


    this.getCharacterInfo = function (character) {
        $.ajax({
            method: 'post',
            url: 'http://danielpaschal.com/lfzproxy.php',
            dataType: 'json',
            data: {
              url: 'http://superheroapi.com/api/10159579732380612/'+ game.availableCharacters[character].heroID,
              color: 'lavender'
            },
            success: function (data) {
                game.apiResponse++;
                console.log(game.apiResponse);
                $('.loadingBar').css('width', game.apiResponse * 7.5 + 17.5 + '%');
                game.availableCharacters[character].characterInfo = data;

                if (game.apiResponse >= 12){
                  $('.modalContainer').show( 1 );
                  $('.loadScreen').hide( 1 );
                }
            },
            error: function () {
                console.warn('something went wrong');
            }
        });

    };

    this.buildCharacterInfo = function() {
        for (var character in game.availableCharacters) {
            this.getCharacterInfo(character);
        }
    };

    this.getQuote = function(winner, winnerImg, winnerSex) {
        var categories = ["dev","movie","food","celebrity","science","political","sport","animal","music","history","travel","career","money","fashion"];
        var randomNum = Math.floor(Math.random() * categories.length);
        var randomCategory = categories[randomNum];



        $.ajax({
            method: 'get',
            url: 'https://api.chucknorris.io/jokes/random',
            dataType: 'json',
            data: {'category': randomCategory},
            success: function (quote) {
                var regEx = new RegExp('chuck norris', 'ig');  //find the word 'chuck norris' in a quote no matter if it's uppercase or lowercase
                var chuckNorrisQuote = quote.value;

                var regEx1 = new RegExp('chuck norris', 'ig');  //find the word 'chuck norris' in a quote no matter if it's uppercase or lowercase
                var winnerQuote = chuckNorrisQuote.replace(regEx1, winner); //change the word 'chuck norris' with winner's name

                var regEx2 = new RegExp('chuck', 'ig');
                winnerQuote = winnerQuote.replace(regEx2, winner);  //change the word 'chuck' with winner's name

                var regEx3 = new RegExp('norris', 'ig');
                winnerQuote = winnerQuote.replace(regEx3, winner);  //change the word 'norris' with winner's name

                if(winnerSex === 'Female'){  //if the sex of the winner is female, change the words 'his' and 'he' to 'her' and 'she'
                    var regEx4 = new RegExp('he', 'ig');
                    winnerQuote = winnerQuote.replace(regEx4, 'she');

                    var regEx5 = new RegExp('his', 'ig');
                    winnerQuote = winnerQuote.replace(regEx5, 'hers');

                    var regEx6 = new RegExp('him', 'ig');
                    winnerQuote = winnerQuote.replace(regEx6, 'her');

                }

                // find all winner's name and color it to lime green;
                var findTheName = winner;
                var replaceAllName = new RegExp(findTheName, 'g');
                var greenTxt = winnerQuote.replace(replaceAllName, winner.fontcolor('limegreen'));

                // var greenTxt = winnerQuote.replace(winner, winner.fontcolor('limegreen'));//makes font tag to change color of the name


                $('.chuckNorrisQuote p').append(greenTxt);
                $('.winningCharacter').css('background-image', 'url("resources/images/characters/' + winnerImg + '")');
            },
            error: function () {
                console.warn('something went wrong!');
            }
        });
    };

      this.selectAnswer = function (element) {
          var specialty = false;

          if (element.answer === 'correct') {
              if (element.category === game.players[game.turn].character.category) {
                  specialty = true;
              }
              this.dealDamage(this.dmgCalculator(element.difficulty, specialty));
          }

          game.view.renderQuestion(game.questionBank);
      };

      this.newGame = function(){ // resets the necessary model properties and dom values to default, deleted players so there won't be any duplicate player objects.
        this.buildQuestionShoe();
        this.turn = 1;
        this.roundTime = 60;
        this.roundTimer = null;
        delete game.players[1];
        delete game.players[2];
        game.avatarClickable=true;
        game.bothPlayersSelected=false;
        $('.chuckNorrisQuote p').empty();
        $('.hitPoints').css('width','100%');
        $('.emptyMe').removeClass('characterName');
        $('.playerAvatar').removeClass('playerAvatarClicked');
      }

      this.domParser = function (input) {
          var doc = new DOMParser().parseFromString(input, "text/html");
          return doc.documentElement.textContent;
      }

}
