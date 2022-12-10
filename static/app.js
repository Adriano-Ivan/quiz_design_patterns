// Values
let correctAnswers = [];
let indexQuestion = 0;
let numberOfQuestions = 0;
let quizWasSelected = false;
let containerQuestionIndicationsMapping = [];
let quizWasFinished = false;

// DOM Elements
const containerQuiz = document.querySelector("#container_quiz");
const showResultsButton = document.querySelector("#show_results_button");
const restartQuizButton = document.querySelector("#restart_quiz_button");
const questionOptions = document.querySelector("#question_options");

//const buttonNextQuestion = document.querySelector("#button_next_question");
//const buttonPreviousQuestion = document.querySelector("#button_previous_question");

const warningOfNotInsufficientAnsweredQuestions = document.querySelector("#warning_of_not_answered");
const contentFeedback = document.querySelector("#content_feedback");

const changeQuizButton = document.querySelector("#change-quiz-button");
const optionsQuiz = document.querySelector("#options_quiz");

const titleQuiz = document.querySelector("#title_quiz");
const quizWasNotSelectedMessage = document.querySelector("#quiz_was_not_selected_message");

const containerQuestionIndications = document.querySelector("#container_question_indication");

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

const processResults = () => {

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
              quizWasFinished = false;
              removeQuestionIndications();

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

              captureNumberOfQuestions(true);
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

const removeQuestionIndications = () => {
    const questionIndications = containerQuestionIndications.querySelectorAll(".span_question_indication");

    questionIndications.forEach((questionIndication)=>{
        containerQuestionIndications.removeChild(questionIndication);
    });
}

const defineQuestionIndications = (quantity) => {
    const newIndicationMappings = [];

    for(let i = 0; i < quantity;i++){
        const spanNumber = document.createElement("span");

        spanNumber.id = `span_question_indication_${i + 1}`;
        spanNumber.classList.add("span_question_indication");
        spanNumber.textContent = i + 1;

        const objectForMapping = {nextQuestionForCurrent: i+1};
        newIndicationMappings.push(objectForMapping);

        containerQuestionIndications.appendChild(spanNumber);
    }

    containerQuestionIndicationsMapping = [...newIndicationMappings];
}

const captureNumberOfQuestions = (isToDefineContainerIndicators) => {
    var number = $.get("/number_of_questions");

    number.done(function(returnedNumber){
        numberOfQuestions = returnedNumber;

        if(isToDefineContainerIndicators){
            defineQuestionIndications(numberOfQuestions);
        }
    });
}

const processChangedOption = (e,nextQuestionExists) => {
    e.preventDefault();

    const questionIdFromInput = e.target.id.split("_")[0];
    const optionIdFromInput = e.target.id.split("_")[1];
    const nextQuestionFromInput = e.target.id.split("_")[2];

    definePickedOptionAppearance(questionIdFromInput,optionIdFromInput );

    var verify = $.post("/verify_answer", {"question_id": questionIdFromInput, "option_id":optionIdFromInput});

    verify.done(function(data){
        updateAuxListForCorrectAndWrongAnswers(data.is_correct,data.description,questionIdFromInput,optionIdFromInput);

        updateQuestionIndicationContainer(nextQuestionFromInput,data.is_correct,nextQuestionExists);
    });
}

const updateQuestionIndicationContainer = (nextQuestionFromInput, answerIsCorrect,nextQuestionExists) => {
    containerQuestionIndicationsMapping.forEach((mapping) => {
        if(mapping.nextQuestionForCurrent === Number(nextQuestionFromInput)){
            mapping.answerWasCorrect = answerIsCorrect;

            const questionIndicator = document.querySelector(`#span_question_indication_${mapping.nextQuestionForCurrent}`);

            if(mapping.answerWasCorrect){
                questionIndicator.classList.remove('indicator_that_was_wrong');
                questionIndicator.classList.add('indicator_that_was_correct');
            } else {
                questionIndicator.classList.remove('indicator_that_was_correct');
                questionIndicator.classList.add('indicator_that_was_wrong');
            }

            if(nextQuestionExists){
               requestQuestion("next_question");
            } else {
                console.log(nextQuestionExists);
                quizWasFinished = true;
                defineShowResultsVisibility(nextQuestionExists);
            }

        }
    });

    containerQuestionIndicationsMapping.forEach((mapping) => {
        console.log(mapping);
    });
}

const requestQuestion = (previousOrNextQuestion) => {

    var defineNextQuestion = $.post(`/${previousOrNextQuestion}`, {[`${previousOrNextQuestion}`]: indexQuestion});

    defineNextQuestion.done(function(data){
        const nextQuestion = data.next_question;

        indexQuestion = nextQuestion;

//        defineButtonPreviousAndNextVisibility(data.next_question_exists);
        if(data.next_question_exists){
            defineShowResultsVisibility(data.next_question_exists);
        }

        console.log(data)
        defineNewQuestionAndAnswers(data.question,nextQuestion,data.next_question_exists);

        markPreviouslySelectedOption();

        captureNumberOfQuestions(false);

        titleQuiz.textContent = `${data.title_quiz}`;
    });
}

const defineShowResultsVisibility = (exists)=>{
    if(!exists){
        restartQuizButton.classList.remove("hide");
        showResultsButton.classList.remove("hide");
    } else {
        restartQuizButton.classList.add("hide");
        showResultsButton.classList.add("hide");
    }
}

const defineNewQuestionAndAnswers = (question, nextQuestionForIndicationContainer,nextQuestionExists) => {
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
        textSpan.classList.add("span_text_option")
        textSpan.id = `span_${questionId}_${option.id}`;

        const radioButton = document.createElement("input");
        radioButton.classList.add("question_answer_option");
        radioButton.id = `${questionId}_${option.id}_${nextQuestionForIndicationContainer}`;
        radioButton.setAttribute("type","radio");
        radioButton.setAttribute("name","question");
        radioButton.classList.add("hide");

        radioButton.addEventListener("change",function(e){
            if(!quizWasFinished){
                processChangedOption(e, nextQuestionExists);
            }
        });

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

captureNumberOfQuestions(true);

showResultsButton?.addEventListener("click", processResults);

showQuizOptions();
//changeQuizButton.addEventListener("click", showQuizOptions);

const confirmExit = () =>{
    return "Deseja realmente sair ? Seu progresso no quiz será perdido...";
}

window.onbeforeunload = confirmExit;


