class Question {

    id
    question
    answerOptions
    answer
    type
    inputAnswer
    hardness
    marksWorth

    constructor(questionObject){

        let {
            question, 
            answerOptions, 
            answer, 
            type, 
            hardness
        } = questionObject;

        this.id = uniqueID(1);
        this.question = question;
        this.answerOptions = answerOptions;
        this.answer = answer;
        this.type = type;
        this.hardness = hardness;

        if(questionObject.inputAnswer != null) 
        this.inputAnswer = questionObject.inputAnswer;

    }

    //TODO: refactor out this function ...
    renderAssessmentArea(...assessmentAreaElements){

        let assessmentArea = document.querySelector(".question-area");
        assessmentArea.innerHTML = "";
        assessmentAreaElements.forEach( element => assessmentArea.appendChild(element) );

    }

}

class MultipleChoice extends Question {

    constructor(questionObject, marksWorth = 1){
        // randomize answer options
        super(questionObject);
        this.marksWorth = marksWorth;
    }

    render(language){

        let question = document.createElement("div");
        question.className = "question";
        question.textContent = this.question[language];

        let answerOptionsList = document.createElement("div");
        answerOptionsList.className = "answer-options-list";

        let answerOptionMap = this.answerOptions[language].map( ( option, index ) => {
            
            let answerOptionContainer = document.createElement("div");

            if(this.inputAnswer == this.answerOptions[language][index]){
                answerOptionContainer.className = "answer-option-container active";
            }else{
                answerOptionContainer.className = "answer-option-container";
            }

            let letterOption = document.createElement("div");
            letterOption.className = "letter-option";
            letterOption.textContent = letters[index];
    
            let answerOption = document.createElement("div");
            answerOption.className = "answer-option";
            answerOption.textContent = option;

            answerOptionContainer.addEventListener("click", () => {

                disableOtherOptions();
                answerOptionContainer.className = "answer-option-container active";

                this.inputAnswer = option;

            });

            answerOptionContainer.appendChild(letterOption);
            answerOptionContainer.appendChild(answerOption);
            answerOptionsList.appendChild(answerOptionContainer);
            return answerOptionContainer;

        });

        function disableOtherOptions(){
            answerOptionMap.forEach( option => option.className = "answer-option-container")
        }

        super.renderAssessmentArea(question, answerOptionsList);
    }
}

class TrueAndFalse extends Question {

    constructor(questionObject, marksWorth = 1){
        super(questionObject);
        this.marksWorth = marksWorth;
    }

    render(language){

        let question = document.createElement("div");
        question.className = "question";
        question.textContent = this.question[language];

        let answerOptions = this.answerOptions[language] || [];

        let answerOptionsList = document.createElement("div");
        answerOptionsList.className = "tf-options-list";

        let answerOptionMap = answerOptions.map( ( option, index ) => {
            
            let answerOptionContainer = document.createElement("div");
            answerOptionContainer.className = "tf-answer-option-container";


            let answerOption = document.createElement("div");
            answerOption.textContent = option;

            if(this.inputAnswer == answerOptions[index]){
                answerOption.className = "button tf-answer-option active";
            }else{
                answerOption.className = "button tf-answer-option";
            }
    

            answerOption.addEventListener("click", () => {

                disableOtherOptions();
                answerOption.className = "button tf-answer-option active";

                this.inputAnswer = option;

            });

            answerOptionContainer.appendChild(answerOption);
            answerOptionsList.appendChild(answerOptionContainer);
            return answerOption;

        });

        function disableOtherOptions(){
            answerOptionMap.forEach( option => option.className = "button tf-answer-option")
        }

        super.renderAssessmentArea(question, answerOptionsList);
    }
}

class FillInTheBlank extends Question {

    constructor(questionObject, marksWorth = 1){
        super(questionObject);
        this.marksWorth = marksWorth;
    }

    render(language){

        let question = document.createElement("div");
        question.className = "question";
        question.textContent = this.question[language];
        
 
            
            let blankTextContainer = document.createElement("div");
            blankTextContainer.className = "fitb-answer-option-container";

            // blankTextEditableField.setAttribute("contentEditable","true");


            let blankTextEditableField = document.createElement("input");
            blankTextEditableField.className = "fitb-answer-input";
            blankTextEditableField.placeholder = "Enter You Answer Here";

            if(this.inputAnswer){
                blankTextEditableField.className = "fitb-answer-input active";
                blankTextEditableField.value = this.inputAnswer;
            }
        
            blankTextEditableField.addEventListener("input", () => {

                blankTextEditableField.className = "fitb-answer-input active";
                this.inputAnswer = blankTextEditableField.value ;

            });

            blankTextContainer.appendChild(blankTextEditableField);

        super.renderAssessmentArea(question, blankTextContainer);
    }
}

function mark(questions, language){

    let result = 0;
    let totalMarks = 0;

    console.log("language: ", language);

    questions.forEach( question => {

        console.log("correct answer: ", question.answer[language])
        console.log("inputted answer: ", question.inputAnswer)

        if(question.answer[language] == question.inputAnswer){
            result += question.marksWorth;
        }
            
        totalMarks += question.marksWorth;
    })

    return { result, totalMarks };

}

function MultipleChoiceQuestionStructure(){
    return {
        id: (string) => "",
        question: (object) => { return {"language" : "answer"} },
        answerOptions: (object) => { return {"language" : [a,a,a,a]} },
        correctAnswer: (object) => { return {"language" : ""} },
        type: (string) => "multiple choice",
        hardness: (string) => "medium",
        marksWorth: (int) => 1
    }
}