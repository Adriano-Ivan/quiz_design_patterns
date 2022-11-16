let correctAnswers = [];
let showResultsButton = document.querySelector("#show_results_button");

const updateAuxListForCorrectAndWrongAnswers = (is_correct,question_id,option_id) =>{
    let theQuestionWasAlreadyAnswered = false;

    for(let i = 0; i < correctAnswers.length; i++){
        if(correctAnswers[i].question_id == question_id){
            correctAnswers[i].is_correct = is_correct;
            correctAnswers[i].answer_id = option_id;

            theQuestionWasAlreadyAnswered = true;
            break;
        }
    }

    if(!theQuestionWasAlreadyAnswered){
        correctAnswers.push(
            {
                question_id : question_id,
                answer_id: option_id,
                is_correct: is_correct
            }
        );
    }
}

const processResults = (e) => {
    correctAnswers.forEach((ca)=>{
        console.log(ca);
    });
}

$(function(){
    $(".question_answer_option").on("change", function(e){
        e.preventDefault();

        const question_id = e.target.id.split("_")[0]
        const option_id = e.target.id.split("_")[1]

        var verify = $.post("/verify_answer", {"question_id": question_id, "option_id":option_id});

        verify.done(function(is_correct){
            updateAuxListForCorrectAndWrongAnswers(is_correct,question_id,option_id);
        });
    })
});


showResultsButton.addEventListener("click", processResults)

