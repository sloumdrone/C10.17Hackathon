//functions for calling questions

$(document).ready(init);

var trivia;
function init(){
    trivia = new TriviaDB();
}

function TriviaDB(player){ //takes in the player object and populates the variables based on players properties
    this.questionAmount = 10;
    this.categoryID = player.categoryID;
    this.difficulty = ['easy','medium','hard'];
    this.questionType = 'multiple';
    this.easyQuestions = [];
    this.mediumQuestions = [];
    this.hardQuestions = [];
    this.retrieveQuestions = function(){
        for(var diff_i = 0; diff_i<this.difficulty.length;diff_i++) {
            $.ajax({
                method: 'GET',
                dataType: 'JSON',
                data: {
                    'amount': this.questionAmount,
                    category: this.categoryID,
                    difficulty: this.difficulty[diff_i],
                    type: this.questionType,
                    token: game.token
                },
                url: 'https://opentdb.com/api.php',
                success: function (data) {
                    if (data.response_code === 0) {
                        switch (this.difficulty[diff_i]{
                            case 'easy':
                                this.easyQuestions.push(data.results);
                                break;
                            case 'medium':
                                this.mediumQuestions.push(data.results);
                                break;
                            case 'hard':
                                this.hardQuestions.push(data.results);
                                break;
                        }
                    }
                },
                error: function () {
                    console.log('error input')
                }
            });//end of ajaxCall
        }
    }
}

function getSessionToken(){ //getting session token, should be called on starting every game
    $.ajax({
        method: 'GET',
        dataType: 'JSON',
        url: 'https://opentdb.com/api_token.php?command=request',
        success: function(data){
           if(data.response_code ===0 ){
              return data.token
           }else{
               console.error('server response'+ data.response_code +" "+data.response_message)
           }
        },
        error: function(){
            console.log('error input')
        }
    });//end of ajaxCall
}