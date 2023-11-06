import { loadDataFromFile, loadDataFromUrl } from "./load-data";
import { reset } from "./quiz";
import { data } from "./quiz-data";
import * as i18n from "./i18n.ts";

export const uploadInput = document.getElementById("upload") as HTMLInputElement;
export const fileUseButton = document.getElementById("use_file") as HTMLButtonElement;
fileUseButton.onclick = loadDataFromFile;

export const fileUrlInput = document.getElementById("file_url") as HTMLInputElement;
export const urlUseButton = document.getElementById("use_url") as HTMLButtonElement;
urlUseButton.onclick = () => loadDataFromUrl(fileUrlInput.value);

export const exampleInput = document.getElementById("example") as HTMLInputElement;
export const exampleUseButton = document.getElementById("use_example") as HTMLButtonElement;
exampleUseButton.onclick = () => loadDataFromUrl(`https://raw.githubusercontent.com/Tr100000/quiz/main/examples/${exampleInput.value}`);

export let currentQuiz: data.QuizData;
export let currentQuizQuestionCount = 0;
export let canLoadQuiz = true;

export const titleText = document.getElementById("quiz_title") as HTMLHeadingElement;
export const descriptionText = document.getElementById("quiz_description") as HTMLHeadingElement;
export const questionCountSpan = document.getElementById("quiz_question_count") as HTMLSpanElement;
export const quizStartButton = document.getElementById("quiz_start") as HTMLButtonElement;
quizStartButton.onclick = startQuiz;

export const progressBar = document.getElementById("progress") as HTMLProgressElement;

export const fileDiv = document.getElementById("fileDiv") as HTMLDivElement;
export const confirmDiv = document.getElementById("confirmDiv") as HTMLDivElement;
export const mainDiv = document.getElementById("mainDiv") as HTMLDivElement;
export const resultsDiv = document.getElementById("resultsDiv") as HTMLDivElement;
fileDiv.hidden = false;
confirmDiv.hidden = true;
mainDiv.hidden = true;
resultsDiv.hidden = true;

i18n.init();

export function parseData(jsonText: string) {
    loadData(JSON.parse(jsonText) as data.QuizData);
}

function loadData(quiz: data.QuizData) {
    currentQuizQuestionCount = 0;

    for (const part of quiz.quiz) {
        currentQuizQuestionCount += part.questions.length;

        for (const question of part.questions) {
            question.header = question.header ?? part.defaults?.header;
            question.type = question.type ?? part.defaults?.type;
            question.text = question.text ?? part.defaults?.text;
            question.options = question.options ?? part.defaults?.options;
            question.correctAnswer = question.correctAnswer ?? part.defaults?.correctAnswer;
            question.correctAnswerDisplay = question.correctAnswerDisplay ?? part.defaults?.correctAnswerDisplay;
        }
    }

    titleText.innerHTML = quiz.title;
    descriptionText.innerHTML = quiz.description ?? "";
    questionCountSpan.innerHTML = currentQuizQuestionCount.toString();

    confirmDiv.hidden = false;
    currentQuiz = quiz;
}

function startQuiz() {
    if (currentQuiz != null) {
        progressBar.value = 0;
        progressBar.max = currentQuizQuestionCount - 1;

        reset();

        fileDiv.setAttribute("style", "display: none;");
        confirmDiv.hidden = true;
        mainDiv.hidden = false;
    }
}
