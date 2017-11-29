//functions for calling questions

$(document).ready(init);

var trivia;
function init(){
    trivia = new TriviaDB();
    TriviaCall(trivia);
}

function TriviaDB(player){ //takes in the player object and populates the variables based on players properties
    this.questionAmount = null;
    this.categoryID = null;
    this.difficulty = null;
    this.questionType = null;
    this.easyQuestionArr = [];
    this.mediumQuestionArr = [];
    this.hardQuestionArr = [];
    this.retrieveQuestions = function(){
        $.ajax({
            method: 'GET',
            dataType: 'JSON',
            data:{
                'amount': this.questionAmount,
                category: this.categoryID,
                difficulty: this.difficulty,
                type: this.questionType
            },
            url: 'https://opentdb.com/api.php',
            success: function(data){
               if(data.response_code===0){
                   return data
               }
            },
            error: function(){
                console.log('error input')
            }
        });//end of ajaxCall
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