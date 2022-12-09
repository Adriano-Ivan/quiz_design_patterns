// Values
let correctAnswers = [];
let indexQuestion = 0;
let numberOfQuestions = 0;
let quizWasSelected = false;

// DOM Elements
const containerQuiz = document.querySelector("#container_quiz");
const showResultsButton = document.querySelector("#show_results_button");
const questionOptions = document.querySelector("#question_options");

const buttonNextQuestion = document.querySelector("#button_next_question");
const buttonPreviousQuestion = document.querySelector("#button_previous_question");

const warningOfNotInsufficientAnsweredQuestions = document.querySelector("#warning_of_not_answered");
const contentFeedback = document.querySelector("#content_feedback");

const changeQuizButton = document.querySelector("#change-quiz-button");
const optionsQuiz = document.querySelector("#options_quiz");

const titleQuiz = document.querySelector("#title_quiz");
const quizWasNotSelectedMessage = document.querySelector("#quiz_was_not_selected_message");

// Functions
const updateAuxListForCorrectAndWrongAnswers = (is_correct,description,question_id,option_id) =>{
    let theQuestionWasAlreadyAnswered = false;

    for(let i = 0; i < correctAnswers.length; i++){
        if(correctAnswers[i].question_id == question_id){
            correctAnswers[i].is_correct = is_correct;
            correctAnswers[i].answer_id = option_id;
            correctAnswers[i].description = description;

            theQuestionWasAlreadyAnswered = true;
            break;
        }
    }

    if(!theQuestionWasAlreadyAnswered){
        correctAnswers.push(
            {
                question_id : question_id,
                answer_id: option_id,
                is_correct: is_correct,
                description: description
            }
        );
    }

}

const processResults = (e) => {
 
    if(correctAnswers.length != numberOfQuestions){
        warningOfNotInsufficientAnsweredQuestions.classList.remove("hidden_warning_of_not_answered");
    } else {
        warningOfNotInsufficientAnsweredQuestions.classList.add("hidden_warning_of_not_answered");
        contentFeedback.classList.remove("hidden_content_feedback");
        const descriptionsOfCorrectAnswers = [];

        correctAnswers.forEach((ca)=>{
            if(ca.is_correct){
                descriptionsOfCorrectAnswers.push(ca.description);
            }
        });

        if(descriptionsOfCorrectAnswers.length == 0){
            descriptionsOfCorrectAnswers.push(`Todas as respostas estão erradas`);
        }

        contentFeedback.textContent = `
            Respostas corretas: ${descriptionsOfCorrectAnswers.map((a,i) => {
                return ` ${a}`;
            })}
        `;
    }
}

const toggleQuizWasNotSelectedMessage = () => {
    if(quizWasSelected){
        quizWasNotSelectedMessage.classList.add("hide");
    } else {
        quizWasNotSelectedMessage.classList.remove("hide");
    }
}

const showQuizOptions = () => {
    var dataQuizTypes = $.get("/list_quizes");

    dataQuizTypes.done(function(data){
       optionsQuiz.classList.remove("hide");

       const typesQuizChildren = document.querySelectorAll(".types_quiz_child");

       typesQuizChildren?.forEach((c) => {
            optionsQuiz.removeChild(c);
       });

        data.types.forEach((c) => {
        const typeQuizChild = document.createElement("button");
        typeQuizChild.classList.add("types_quiz_child");
        typeQuizChild.classList.add("btn");
        typeQuizChild.classList.add("btn-success");
        typeQuizChild.classList.add("m-2");

        typeQuizChild.textContent = `${quizTypes[c]}`;

        typeQuizChild.addEventListener("click", function(e){
              var changeQuiz = $.post("/change_quiz", {"quiz_type": c});

              changeQuiz.done(function(data){
                if(data.type !== null){
                    correctAnswers = [];
                    indexQuestion = 0;
                    numberOfQuestions = 0;

                    requestQuestion("next_question");

                    quizWasSelected = true;

                    toggleQuizWasNotSelectedMessage();
                }
              });

              captureNumberOfQuestions();
              contentFeedback.classList.add("hidden_content_feedback");
              warningOfNotInsufficientAnsweredQuestions.classList.add("hidden_warning_of_not_answered");
              containerQuiz.classList.remove("hide");
        });

        optionsQuiz.appendChild(typeQuizChild);
       });

    });
}

const definePickedOptionAppearance =  (question_id, option_id) =>{
    const pickedOption = document.querySelector(".picked_option");

    if(pickedOption){
        pickedOption.classList.remove("picked_option");
    }

    const selectedOptionToMark = document.querySelector(`#span_${question_id}_${option_id}`);
    selectedOptionToMark.classList.add("picked_option");
}

const markPreviouslySelectedOption = () => {
    const options = document.querySelectorAll('.question_answer_option');

    for(let i = 0 ; i < options.length; i++){
        let optionsWasFound = false;
        for(let j = 0 ; j < correctAnswers.length;j++){

            const answerInputId = options[i].id;

            const questionId = Number(answerInputId.split("_")[0]);
            const answerId = Number(answerInputId.split("_")[1]);

            if(questionId == correctAnswers[j].question_id && answerId == correctAnswers[j].answer_id){
                optionsWasFound = true;
                options[i].checked = true;
                definePickedOptionAppearance(questionId, answerId);
                break;
             }
        }

        if(optionsWasFound){
            break;
        }
    }
}

const captureNumberOfQuestions = () => {
    var number = $.get("/number_of_questions");

    number.done(function(returnedNumber){
        numberOfQuestions = returnedNumber;
    });
}

const processChangedOption = (e) => {
    e.preventDefault();

    const question_id = e.target.id.split("_")[0];
    const option_id = e.target.id.split("_")[1];

    definePickedOptionAppearance(question_id,option_id);

    var verify = $.post("/verify_answer", {"question_id": question_id, "option_id":option_id});

    verify.done(function(data){
        updateAuxListForCorrectAndWrongAnswers(data.is_correct,data.description,question_id,option_id);
    });
}

const requestQuestion = (previousOrNextQuestion) => {

    var defineNextQuestion = $.post(`/${previousOrNextQuestion}`, {[`${previousOrNextQuestion}`]: indexQuestion});

    defineNextQuestion.done(function(data){
        const nextQuestion = data.next_question;

        indexQuestion = nextQuestion;

        defineButtonPreviousAndNextVisibility(data.next_question_exists);

        defineShowResultsVisibility(data.next_question_exists);
        defineNewQuestionAndAnswers(data.question);

        markPreviouslySelectedOption();

        captureNumberOfQuestions();

        titleQuiz.textContent = `${data.title_quiz}`;
    });
}

const defineButtonPreviousAndNextVisibility = (exists) =>{
    if(indexQuestion == 1){
        buttonPreviousQuestion.classList.add("hide");
    } else {
        buttonPreviousQuestion.classList.remove("hide");
    }

    if(!exists){
        buttonNextQuestion.classList.add("hide");
    } else {
        buttonNextQuestion.classList.remove("hide");
    }
}

const defineShowResultsVisibility = (exists)=>{
    if(!exists){
        showResultsButton.classList.remove("hide");
    } else {
        showResultsButton.classList.add("hide");
    }
}

const defineNewQuestionAndAnswers = (question) => {
    const containerQuestionOptions = document.querySelectorAll(".container_question_options");

    // Defining question text
    const questionText = document.querySelector("#question_text");
    questionText.textContent=question.question_content;

    // Remove previous containers
    containerQuestionOptions.forEach((containerQuestionOption,i)=>{
        questionOptions.removeChild(containerQuestionOption);
    });

    // Create new containers with new data
    const questionId = question.id;
    const questionOptionsAnswers = question.answer_options;

    questionOptionsAnswers.forEach((option) => {
        // Creating element
        const newContainerQuestionOption = document.createElement("label");

        // Defining attributes
        newContainerQuestionOption.classList.add("container_question_options");
        newContainerQuestionOption.id = `question_${questionId}_${option.id}`;

        // Creating container children
        const textSpan = document.createElement("span");
        textSpan.textContent = option.description;
        textSpan.id = `span_${questionId}_${option.id}`;

        const radioButton = document.createElement("input");
        radioButton.classList.add("question_answer_option");
        radioButton.id = `${questionId}_${option.id}`;
        radioButton.setAttribute("type","radio");
        radioButton.setAttribute("name","question");
        radioButton.classList.add("hide");

        radioButton.addEventListener("change",processChangedOption);

        // Adding children elements to container
        newContainerQuestionOption.appendChild(radioButton);
        newContainerQuestionOption.appendChild(textSpan);

        // Adding container to form
        questionOptions.appendChild(newContainerQuestionOption);
    });
}

// Listeners
$(function(){
    $(".question_answer_option").on("change",processChangedOption);
});

$(function(){
    $("#button_previous_question").on("click", function(e){
        if(indexQuestion >= 0){
            contentFeedback.classList.add("hidden_content_feedback");
            warningOfNotInsufficientAnsweredQuestions.classList.add("hidden_warning_of_not_answered");
            requestQuestion("previous_question");

        }
    });
});

$(function(){
    $("#button_next_question").on("click", function(e){
        requestQuestion("next_question");

    });
});

captureNumberOfQuestions();

showResultsButton?.addEventListener("click", processResults);

showQuizOptions();
//changeQuizButton.addEventListener("click", showQuizOptions);

const confirmExit = () =>{
    return "Deseja realmente sair ? Seu progresso no quiz será perdido...";
}

window.onbeforeunload = confirmExit;


