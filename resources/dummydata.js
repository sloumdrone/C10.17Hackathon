var dataResults = [];
var questionCount = null;
$(document).ready(function(){
    $.ajax({
        method: 'GET',
        dataType: 'JSON',
        url: 'https://opentdb.com/api.php?amount=10&type=multiple',
        success: function (data) {
            if (data.response_code === 0) {
                v = data;
                questionCount= data.results.length;
               renderQuestions(data.results);
            }
        },
        error: function () {
            console.log('error input')
        }
    });//end of ajaxCall
    $('.questionModal').on('click','.answer', function(){
        console.log(this.answer)
    })
});

function renderQuestions(questions){
    var qArray = questions;
    var entry = questions.shift(0);
    var question = htmlDecode(entry.question);//parses html entities from api string
    var ansList = entry.incorrect_answers; //array of incorrect answers
    var correctAns = entry.correct_answer;
    var randomNum = Math.floor(Math.random()*4);
    ansList.splice(randomNum,0, correctAns);
    questionCount--;
    $('.questionContainer p').text(question);
    for(var ans_i=0;ans_i<ansList.length;ans_i++){
        createDiv(ans_i, correctAns, ansList[ans_i]);
    }
}

function createDiv(num, answer, text){
    var ansDiv= $('<div>',{
        id: 'q'+num,
        'class': 'answer',
        text: text
    });
    if(text!==answer){
        ansDiv[0].answer= 'incorrect';
    }else{
        ansDiv[0].answer = 'correct'
    }
    $('.questionModal').append(ansDiv)
}

function htmlDecode(input) //parser of unescaped HTML Entities
{
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}