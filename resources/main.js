$(document).ready(initialize);

var controller = null;
console.log(' *********** controller initializing', controller);

function initialize(){
    controller = null;
    controller = new Controller();
    controller.init();
    $('.restart').on('click', controller.restartGame.bind(this));
}


function addClickHandlers(game, view, controller){
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
            view.addOutlineToSelectedPlayer();
        }
    });

    $('.questionModal').on('click', '.answer', function(){
        controller.selectAnswer(this, view)
    });

    $('.readyButton').on('click',function(){
        controller.questionBank(game.questions);
        game.roundTime = 60;
        view.renderTimer();
        $('.readyBanner').fadeOut();

        $('.questionModal').addClass('questionModalShow');
    });



}


function GameModel(){

    this.init = function (view){
        this.view = view;
        this.gameState = 'playerSelection'; //playerSelection, loading, trivia, ready, endgame
        this.avatarClickable = true;
        this.playButtonClickable = false;
        this.bothPlayersSelected = false;
        this.turn = 1;
        this.roundTime = 60; //just a starting number, tracks amount of time left in round;
        // this.questionsLeft = 10; //tracks the number of questions asked
        this.roundTimer = null;
        this.questions = {};
        this.players = {
            //1 : Player {}
            //2 : Player {}
            //built using the add
        };
        this.quoteGenerated = false;   // flag for Chuck Norris quote ajax call


    };


    this.backgrounds = [
      'sewers.gif',
      'water-fall.gif',
      'wood-ruins.gif',
      'mansion.gif',
      'over-pass.gif'
    ];

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
            this.gameState = 'loading';
            this.avatarClickable = false;
            this.view.activePlayButton();
            this.bothPlayersSelected = true;
            console.log(this.players)
            //display loading screen
            //gather trivia questions based on characters
            //when done, load function will trigger ready state
        }
    }
}

function Player(characterSelection, game){
    this.hitPoints = 100; //we can do whatever here. 100 is just a starting point.
    this.character = game.availableCharacters[characterSelection];
    console.log(game.players);

}

function View(model, controller){
    var that = this;
    that.model = model;
    that.controller = controller;
  //all of our functions for updating the view will go here

    that.showEndgameWinner = function() {
        clearInterval(this.model.roundTimer);
        $('.readyButton span').text('P1');
        var winner;
        var winnerImg;
        var winnerSex;
        if (model.players['1']['hitPoints'] > 0) {
            // winner = model.players['1']['name'];
            winner = model.players['1']['character']['name'];
            winnerImg = this.model.players['1']['character']['img'];
            winnerSex = this.model.players[1]['character']['characterInfo']['appearance']['gender'];
        } else {
            // winner = model.players['2']['name'];
            winner = this.model.players['2']['character']['name'];
            winnerImg = this.model.players['2']['character']['img'];
            winnerSex = this.model.players[1]['character']['characterInfo']['appearance']['gender'];
        }

        if($('.chuckNorrisQuote p').text() === '') {
            controller.getQuote(winner, winnerImg, winnerSex, model.quoteGenerated);
        }
        $('.gameBoard').fadeOut(1500);
        $('.winnerModal').fadeIn(1500);
    };



    that.renderQuestion = function(qArray){ //renders Question and answers into Arena
        $('.answer').remove();
        var entry = qArray.shift();
        var category = entry.category;
        var question = that.controller.domParser(entry.question);//parses html entities from api string
        var ansList = entry.incorrect_answers; //array of incorrect answers
        var correctAns = entry.correct_answer;
        console.log(correctAns);
        var randomNum = Math.floor(Math.random()*4);
        ansList.splice(randomNum,0, correctAns);
        // model.questionsLeft--;
        var catSpan = $('<span>',{
            text: category,
            'class': 'category'
        });
        $('.questionContainer p').text(question).append(catSpan);
        for(var ans_i=0;ans_i<ansList.length;ans_i++){
            this.createAnsDiv(ans_i,ansList[ans_i], entry);
        }
        if(that.model.questionBank.length===0){
            $('.questionModal').removeClass('questionModalShow');
            clearInterval(that.model.roundTimer);
            //wincheckstate & player change
            if(that.model.turn===1){
                $('.readyButton span').text('P2')
            }else{
                $('.readyButton span').text('P1')
            }
            that.controller.checkWinState();
        }
    };

    that.createAnsDiv=function(num,text, entry){
        var ansDiv= $('<div>',{
            id: 'q'+num,
            'class': 'answer',
            text: controller.domParser(text)
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

    that.renderDmg = function(amount){
        if(that.model.turn === 1){
            currentHpBar = $('.right');

        }else{
            currentHpBar = $('.left');
        }
        currentHpBar.css('width', amount+"%") //reduces the width by the percentage of the dmg.
    };

    that.addOutlineToSelectedPlayer = function(){
        $(event.target).addClass('playerAvatarClicked');
    };

    that.activePlayButton = function(){
        console.log('inside the button',that.model);
        that.model.playButtonClickable = true;
        $('.playButton').click(function(){
            if(that.model.playButtonClickable) {
                console.log('inside of play button click function');
              that.model.playButtonClickable = false;
              that.model.avatarClickable = false;
              that.model.turn = 1;


              $('.modalContainer').hide();
              $('#p1name').text(model.players[1].character.name);
              $('#p2name').text(model.players[2].character.name);
              $('.gameBoard').show();
              $('.readyBanner').show('slow');

              // add function that triggers game start/load screen
            }
        });
        this.renderHeroInArena(model.players);
    };

    that.handleAvatarHover = function (){
        $('.playerAvatar').hover(function () {
            if (that.model.bothPlayersSelected === false) {
                var characterImg = $(event.target).attr('id');
                if (that.model.turn === 1) {
                    $('.playerContainerLeft').css('background-image', "url('resources/images/characters/" + model.availableCharacters[characterImg].img + "')");
                    $('.characterNameLeft').text(model.availableCharacters[characterImg].name);
                    $('.infoHeaderName').text('Real Name: ');
                    $('#realNameLeft').text(model.availableCharacters[characterImg].characterInfo.biography['full-name']);
                    $('.infoHeaderPower').text('Power: ');
                    $('#categoryIDLeft').text(model.availableCharacters[characterImg].category);
                    $('.infoHeaderOccupation').text('Occupation: ');
                    $('#occupationLeft').text(model.availableCharacters[characterImg].characterInfo.work.occupation.split(',')[0]);
                } else {
                    $('.playerContainerRight').css('background-image', "url('resources/images/characters/" + model.availableCharacters[characterImg].img + "')");
                    $('.characterNameRight').text(model.availableCharacters[characterImg].name);
                    $('.infoHeaderNameRight').text('Real Name: ');
                    $('#realNameRight').text(model.availableCharacters[characterImg].characterInfo.biography['full-name']);
                    $('.infoHeaderPowerRight').text('Power: ');
                    $('#categoryIDRight').text(model.availableCharacters[characterImg].category);
                    $('.infoHeaderOccupationRight').text('Occupation: ');
                    $('#occupationRight').text(model.availableCharacters[characterImg].characterInfo.work.occupation.split(',')[0]);
                }
            }
        }.bind(this), function () {
            if (model.turn === 1) {
                $('.playerContainerLeft').removeClass('playerPhotoLeft');
            } else {
                $('.playerContainerRight').removeClass('playerPhotoRight');
            }
        });
    };

    that.renderHeroInArena = function(players){   //renders each players img to main game board arena
        $('.player1').css('background-image', 'url("resources/images/characters/'+ players[1].character.img+'")');
        $('.player2').css('background-image', 'url("resources/images/characters/'+ players[2].character.img+'")');
    };

    that.renderTimer = function(){   // renders the timer for each player
        that.model.roundTimer  = setInterval(function() {
            that.model.roundTime--;
            $('.currentTime').text(that.model.roundTime);
            if(that.model.roundTime===0){
                $('.questionModal').removeClass('questionModalShow');
                clearInterval(that.model.roundTimer);
                if(that.model.turn===1){
                    $('.readyButton span').text('P2')
                }else{
                    $('.readyButton span').text('P1')
                }
                $('.readyBanner').show();
                }
            }, 1000);
    }

}


function Controller(){
    this.model = null;
    this.view = null;

    this.init = function(){
        this.model = new GameModel(this.view);
        this.view = new View(this.model, this);
        this.model.init(this.view);

        this.buildQuestionShoe();
        addClickHandlers(this.model, this.view, this);
        this.view.handleAvatarHover();
        this.buildCharacterInfo();
        $('.gameBoard').css('background-image','url("./resources/images/backgrounds/' + this.model.gameBoardBackgrounds[Math.floor(Math.random()*this.model.gameBoardBackgrounds.length)] + '")');

    };

    this.questionBank = function(questionsObj){
        var qBank = [];
        for(key in questionsObj){
            // for(var main_i = 0;main_i<questionsArrMain.length;main_i++){
            if(questionsObj[key].length<10){
                this.checkWinState(questionsObj[key]);
                return;
            }
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
        this.model.questionBank = qBank;
        this.view.renderQuestion(this.model.questionBank);
    };


  this.dealDamage = function(amount){
    this.model.turn === 1
    ? this.model.players[this.model.turn + 1]['hitPoints'] -= amount
    : this.model.players[this.model.turn - 1]['hitPoints'] -= amount;
    var hpTarget= null;
    if(this.model.turn===1){
        hpTarget = this.model.players[2]['hitPoints']
    }else{
        hpTarget = this.model.players[1]['hitPoints']
    }
    this.view.renderDmg(hpTarget);
    if(this.model.questionBank===0 || this.model.players['1']['hitPoints']<=0 ||  this.model.players['2']['hitPoints']<=0){
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
              damagePercent+=14;
              break;
          case 'medium':
              damagePercent+=17;
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
                this.model.token = data.token;
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
      if(this.model.questions['easy'].length<10 ||this.model.questions['medium'].length<10 ||this.model.questions['hard'].length<10){
          if(this.model.players[1].hitPoints>this.model.players[2]){
              this.model.gameState = 'endgame';
              this.model.players[2].hitPoints=0;
              this.view.showEndgameWinner()
              clearInterval(this.model.roundTimer)
              this.model.players[1].hitPoints=100;
              this.model.players[2].hitPoints=100;

          }else{
              this.model.players[1].hitPoints=0;
              this.view.showEndgameWinner()
              clearInterval(this.model.roundTimer)
              this.model.players[1].hitPoints=100;
              this.model.players[2].hitPoints=100;
          }
      }
      if (this.model.players['1']['hitPoints'] <= 0 || this.model.players['2']['hitPoints'] <= 0) {
          this.model.gameState = 'endgame';
          this.view.showEndgameWinner();
          clearInterval(this.model.roundTimer)
          this.model.players[1].hitPoints=100;
          this.model.players[2].hitPoints=100;
      } else {
          if (this.model.turn === 1) {
              this.model.turn += 1;
          } else {
              this.model.turn -= 1;
          }
          clearInterval(this.model.roundTimer);
          $('.readyBanner').slideDown('slow');
          this.questionBank(this.model.questions)
      }
  };

      this.retrieveQuestions = function (diff) {
          var self = this;
          var that = this;
          $.ajax({
              method: 'GET',
              dataType: 'JSON',
              data: {
                  'amount': 50,
                  difficulty: diff,
                  type: 'multiple',
                  token: this.model.token
              },
              url: 'https://opentdb.com/api.php',
              success: function (data) {
                  $(self).unbind();
                  console.log(data);
                  if (data.response_code === 0) {
                      console.log('inside the retrieveQuestions',this.model);
                      that.model.questions[diff] = data.results;
                  } else {
                      alert('Issue with question retrieval. Response code: ' + data.response_code);
                  }
              }.bind(self),
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


    this.getCharacterInfo = function (character, model) {
        $.ajax({
            method: 'post',
            url: 'http://danielpaschal.com/lfzproxy.php',
            dataType: 'json',
            data: {
              url: 'http://superheroapi.com/api/10159579732380612/'+ model.availableCharacters[character].heroID,
              color: 'lavender'
            },
            success: function (data) {
                model.availableCharacters[character].characterInfo = data;
            },
            error: function () {
                console.warn('something went wrong');
            }
        });

    };

    this.buildCharacterInfo = function() {
        for (var character in this.model.availableCharacters) {
            this.getCharacterInfo(character, this.model);
        }
    };

    this.getQuote = function(winner, winnerImg, winnerSex) {
        var categories = ["dev","movie","food","celebrity","science","political","sport","animal","music","history","travel","career","money","fashion"]
        var randomNum = Math.floor(Math.random() * categories.length);
        var randomCategory = categories[randomNum];
        var self = this;
        var that = this;
        event.preventDefault();
        // console.log('1',quoteGenerated);
            $.ajax({
                method: 'get',
                url: 'https://api.chucknorris.io/jokes/random',
                dataType: 'json',
                data: {'category': randomCategory},
                success: function (data) {
                    $(self).unbind();
                    console.log('original', data.value);
                    that.renderQuote(data.value,winner, winnerImg, winnerSex);
                }.bind(self),
                error: function () {
                    console.warn('something went wrong!');
                }
            });

    };

      this.selectAnswer = function (element) {
          var specialty = false;

          if (element.answer === 'correct') {
              if (element.category === this.model.players[this.model.turn].character.category) {
                  specialty = true;
              }
              this.dealDamage(this.dmgCalculator(element.difficulty, specialty));
          }
          this.view.renderQuestion(this.model.questionBank);
      };
      this.domParser = function (input) {
          var doc = new DOMParser().parseFromString(input, "text/html");
          return doc.documentElement.textContent;
      }

      this.renderQuote = function(quote, winner, winnerImg, winnerSex){
          var chuckNorrisQuote = quote;

          var regEx1 = new RegExp('chuck norris', 'ig');  //find the word 'chuck norris' in a quote no matter if it's uppercase or lowercase
          var winnerQuote = chuckNorrisQuote.replace(regEx1, winner); //change the word 'chuck norris' with winner's name

          var regEx2 = new RegExp('chuck', 'ig');
          winnerQuote = winnerQuote.replace(regEx2, winner);  //change the word 'chuck' with winner's name

          var regEx3 = new RegExp('norris', 'ig');
          winnerQuote = winnerQuote.replace(regEx3, winner);  //change the word 'norris' with winner's name

          if (winnerSex === 'Female') {  //if the sex of the winner is female, change the words 'his' and 'he' to 'her' and 'she'
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
          console.log(winner)
          console.log('winnerQuote', winnerQuote);
          // var greenTxt = winnerQuote.replace(winner, winner.fontcolor('limegreen'));//makes font tag to change color of the name


          $('.chuckNorrisQuote p').append(greenTxt);
          $('.winningCharacter').css('background-image', 'url("resources/images/characters/' + winnerImg + '")');
      }

      this.restartGame = function(){
          console.log('restart game works')


          console.log('this       : ', this)

          $('.winnerModal').hide();
          $('.modalContainer').show();


          $('.playerContainerLeft').css('background-image', "none");
          $('.characterNameLeft').text('');
          $('.infoHeaderName').text('');
          $('#realNameLeft').text('');
          $('.infoHeaderPower').text('');
          $('#categoryIDLeft').text('');
          $('.infoHeaderOccupation').text('');
          $('#occupationLeft').text('');

          $('.playerContainerRight').css('background-image', "none");
          $('.characterNameRight').text('');
          $('.infoHeaderNameRight').text('');
          $('#realNameRight').text('');
          $('.infoHeaderPowerRight').text('');

          $('#categoryIDRight').text('');
          $('.infoHeaderOccupationRight').text('');
          $('#occupationRight').text('');

          $('.left').css('width', "100%");
          $('.right').css('width', "100%");


          $('.playerAvatar').removeClass('playerAvatarClicked');


          $('.restart').unbind('click');
          $('.playerAvatar').unbind('hover');
          $('.playerAvatar').unbind('click');
          $('.questionModal').unbind('click');
          // $('.readyButton').unbind('click');

          // clearInterval(this.model.roundTimer)


          initialize();

      };

}

