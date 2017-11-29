$(document).ready(init);


function init(){
    var trivia = new TriviaDB();
}

function TriviaDB(){
    this.easyQuestionArr = [];
    this.easyQuestionData= {};
    this.mediumQuestionArr = [];
    this.mediumQuestionData= {};
    this.hardQuestionArr = [];
    this.hardQuestionData= {};
    this.
}

function TriviaCall (database){
    $.ajax({
        method: 'GET',
        dataType: 'JSON',
        url: 'https://opentdb.com/api.php?amount=1&category=12&difficulty=easy&type=multiple',
        success: function(data){
            console.log(data);
        },
        error: function(){
            console.log('error input')
        }
    });//end of ajaxCall
}