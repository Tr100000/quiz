import * as main from "./main.ts";
import { QuizMultipleChoiceQuestion, QuizQuestion, QuizTextInputQuestion, QuizTrueOrFalseQuestion, QuizYesOrNoQuestion } from "./question.ts";
import { data } from "./quiz-data.ts";  
import { utils } from "./utils.ts";

export let currentQuestion: number;
export let questions: QuizQuestion[];

export const topText = document.getElementById("top_text") as HTMLHeadingElement;
export const questionText = document.getElementById("question_text") as HTMLHeadingElement;

export const questionContentsDiv = document.getElementById("question_contents") as HTMLDivElement;

export function nextQuestion() {
    currentQuestion++;
    main.progressBar.value = currentQuestion;

    topText.innerHTML = utils.valueWithDefault(questions[currentQuestion].question.top_text, "");
    questionText.innerHTML = questions[currentQuestion].question.text!; 
}

export function reset() {
    currentQuestion = -1;
    questionContentsDiv.innerHTML = "";

    if (main.currentQuiz != null) {
        questions = new Array(main.currentQuizQuestionCount);
        let questionIndex = 0;
        for (const element of main.currentQuiz.quiz) {
            let part = element;

            if (part.randomizeQuestionOrder) {
                utils.shuffleArray(part.questions);
            }
            
            for (let j = 0; j < part.questions.length; j++) {
                let question = makeQuizQuestion(part.questions[j], j);
                questions[currentQuestion] = question;
                questionContentsDiv.appendChild(question.setupHtml());
            }

            questionIndex++;
        }

        nextQuestion();
    }
}

function makeQuizQuestion(question: data.Question, index: number): QuizQuestion {
    switch (question.type!) {
        case "multiple_choice":
            return new QuizMultipleChoiceQuestion(question, index);
        case "yes_or_no":
            return new QuizYesOrNoQuestion(question, index);
        case "true_or_false":
            return new QuizTrueOrFalseQuestion(question, index);
        case "text_input":
            return new QuizTextInputQuestion(question, index);
        default:
            throw new Error("sorry");
    }
}
