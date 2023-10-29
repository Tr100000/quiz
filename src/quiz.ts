import * as main from "./main.ts";
import { QuizMultipleChoiceQuestion, QuizQuestion, QuizTextInputQuestion, QuizTrueOrFalseQuestion, QuizYesOrNoQuestion } from "./question.ts";
import { data } from "./quiz-data.ts";
import { utils } from "./utils.ts";

export let currentQuestion: number;
export let questions: QuizQuestion[];

export const previousQuestionButton = document.getElementById("previous") as HTMLButtonElement;
export const nextQuestionButton = document.getElementById("next") as HTMLButtonElement;
export const currentQuestionText = document.getElementById("current_question") as HTMLParagraphElement;
previousQuestionButton.onclick = previousQuestion;
nextQuestionButton.onclick = nextQuestion;

export const topText = document.getElementById("top_text") as HTMLHeadingElement;
export const questionText = document.getElementById("question_text") as HTMLHeadingElement;

export const questionContentsDiv = document.getElementById("question_contents") as HTMLDivElement;

export const finishQuizButton = document.getElementById("end") as HTMLButtonElement;
finishQuizButton.onclick = finishQuiz;

export const mistakesTableBody = document.getElementById("mistakes") as HTMLTableSectionElement;

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
        document.getElementById(`q${currentQuestion}`)!.setAttribute("style", "");
    
        main.progressBar.value = currentQuestion;
        currentQuestionText.innerHTML = `Question ${currentQuestion + 1}`;
    
        const question = questions[currentQuestion].question;
        topText.innerHTML = question.top_text ?? "";
        questionText.innerHTML = question.text ?? "";
    }
}

export function reset() {
    currentQuestion = -1;
    questionContentsDiv.innerHTML = "";

    if (main.currentQuiz != null) {
        questions = new Array(main.currentQuizQuestionCount);
        let questionIndex = 0;
        for (const part of main.currentQuiz.quiz) {

            if (part.randomizeQuestionOrder) {
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
    let confirmText = "Are you really finished?";
    if (unanswered > 0) {
        confirmText += `\n\nYou have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}`;
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

        document.getElementById("score")!.innerHTML = `Your score: ${Math.round(correct / questions.length * 1000) / 10}% (${correct}/${questions.length})`;

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
            questionData.innerHTML = mistake.question.text!;
            yourAnswerData.innerHTML = mistake.getCurrentAnswerDisplay() ?? mistake.getCurrentAnswer();
            correctAnswerData.innerHTML = mistake.question.correctAnswerDisplay ?? mistake.getCorrectAnswerDisplay() ?? mistake.question.correctAnswer ?? "";

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
