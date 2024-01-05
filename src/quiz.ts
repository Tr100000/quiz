import { data } from "./data.ts";
import * as i18n from "./i18n.ts";
import * as main from "./main.ts";
import { QuizMultipleChoiceQuestion, QuizQuestion, QuizTextInputQuestion, QuizTrueOrFalseQuestion, QuizYesOrNoQuestion } from "./question.ts";
import { utils } from "./utils.ts";

let currentQuestion: number;
let questions: QuizQuestion[];

export const progressBar = document.getElementById("progress") as HTMLProgressElement;

const previousQuestionButton = document.getElementById("previous") as HTMLButtonElement;
const nextQuestionButton = document.getElementById("next") as HTMLButtonElement;
const currentQuestionText = document.getElementById("current_question") as HTMLParagraphElement;
previousQuestionButton.onclick = previousQuestion;
nextQuestionButton.onclick = nextQuestion;

const topText = document.getElementById("top_text") as HTMLHeadingElement;
const questionText = document.getElementById("question_text") as HTMLHeadingElement;

const questionContentsDiv = document.getElementById("question_contents") as HTMLDivElement;

const finishQuizButton = document.getElementById("end") as HTMLButtonElement;
finishQuizButton.onclick = finishQuiz;

const mistakesTableBody = document.getElementById("mistakes") as HTMLTableSectionElement;

document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) {
        return;
    }

    switch (e.key) {
        case "[":
            previousQuestion();
            break;
        case "]":
            nextQuestion();
            break;
    }
});

export function nextQuestion() {
    changeCurrentQuestion(currentQuestion + 1);
}

export function previousQuestion() {
    changeCurrentQuestion(currentQuestion - 1);
}

export function changeCurrentQuestion(nextQuestion: number) {
    if (nextQuestion >= 0 && nextQuestion < questions.length) {
        if (currentQuestion >= 0) {
            document.getElementById(`q${currentQuestion}`)!.setAttribute("style", "display: none;");
        }
        currentQuestion = nextQuestion;
        document.getElementById(`q${currentQuestion}`)!.setAttribute("style", questions[nextQuestion].data.style ?? "");
    
        progressBar.value = currentQuestion;
        currentQuestionText.innerHTML = i18n.getTranslation("main.current").replace("{}", (currentQuestion + 1).toString());
    
        const question = questions[currentQuestion].data;
        topText.innerHTML = question.header ?? "";
        questionText.innerHTML = question.text ?? "";
    }
    if (nextQuestion >= questions.length) {
        finishQuiz();
    }
}

export function reset() {
    currentQuestion = -1;
    questionContentsDiv.innerHTML = "";

    if (main.currentQuiz != null) {
        questions = new Array(main.currentQuizQuestionCount);
        let questionIndex = 0;
        for (const part of main.currentQuiz.quiz) {

            if (part.shuffle) {
                utils.shuffleArray(part.questions);
            }
            
            for (let j = 0; j < part.questions.length; j++) {
                let question = makeQuizQuestion(part.questions[j], j);
                questions[questionIndex] = question;

                const div = question.setupHtml();
                div.classList.add("question");
                div.classList.add(`question_${question.getClassName()}`);
                div.id = `q${questionIndex}`;
                questionContentsDiv.appendChild(div);
                div.setAttribute("style", "display: none;");

                questionIndex++;
            }
        }

        changeCurrentQuestion(0);
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
            alert(`Invalid question type for question ${index}!`);
            throw new Error("sorry");
    }
}

function finishQuiz() {
    let unanswered = 0;
    for (const question of questions) {
        if (utils.isNullOrWhitespace(question.getCurrentAnswer())) {
            unanswered++;
        }
    }
    let confirmText = i18n.getTranslation("main.finish_confirm");
    if (unanswered > 0) {
        confirmText += `\n\n${i18n.getTranslation("main.finish_confirm.unanswered").replace("{}", unanswered.toString())}`;
    }
    if (confirm(confirmText)) {
        main.mainDiv.hidden = true;
        main.resultsDiv.hidden = false;

        const mistakes: QuizQuestion[] = new Array();

        let correct = 0;
        for (const question of questions) {
            if (question.isCorrect()) {
                correct++;
            }
            else {
                mistakes.push(question);
            }
        }

        document.getElementById("score")!.innerHTML = i18n.getTranslation("results.score").replace("{0}", Math.round(correct/ questions.length * 1000) / 10 + "%").replace("{1}", `${correct}/${questions.length}`);

        makeMistakesTable(mistakes);
    }
}

function makeMistakesTable(mistakes: QuizQuestion[]) {
    if (mistakes.length > 0) {
        for (const mistake of mistakes) {
            const row = document.createElement("tr");
            const indexData = document.createElement("td");
            const questionData = document.createElement("td");
            const yourAnswerData = document.createElement("td");
            const correctAnswerData = document.createElement("td");

            indexData.innerHTML = (mistake.index + 1).toString();
            questionData.innerHTML = mistake.data.text!;
            yourAnswerData.innerHTML = mistake.getCurrentAnswerDisplay() ?? mistake.getCurrentAnswer();
            correctAnswerData.innerHTML = mistake.data.correctAnswerDisplay ?? mistake.getCorrectAnswerDisplay() ?? mistake.data.correctAnswer ?? "";

            row.appendChild(indexData);
            row.appendChild(questionData);
            row.appendChild(yourAnswerData);
            row.appendChild(correctAnswerData);

            mistakesTableBody.appendChild(row);
        }
    }
    else {
        document.getElementById("mistakesTable")!.hidden = true;
        document.getElementById("perfect")!.hidden = false;
    }
}
