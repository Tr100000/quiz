const searchParams = new URLSearchParams(window.location.search);

import { data } from "./data.ts";
import * as i18n from "./i18n.ts";
import { injectStyleFromUrl, loadDataFromFile, loadDataFromUrl } from "./loader.ts";
import { init } from "./quiz";

const fileUseButton = document.getElementById("use_file") as HTMLButtonElement;
fileUseButton.addEventListener("click", loadDataFromFile);

const fileUrlInput = document.getElementById("file_url") as HTMLInputElement;
const urlUseButton = document.getElementById("use_url") as HTMLButtonElement;
urlUseButton.addEventListener("click", () => loadDataFromUrl(fileUrlInput.value));

export let currentQuiz: data.QuizData;
export let currentQuizQuestionCount = 0;

const titleText = document.getElementById("quiz_title") as HTMLHeadingElement;
const descriptionText = document.getElementById("quiz_description") as HTMLHeadingElement;
const questionCountSpan = document.getElementById("quiz_question_count") as HTMLSpanElement;
const quizStartButton = document.getElementById("quiz_start") as HTMLButtonElement;
quizStartButton.addEventListener("click", startQuiz);

const fileDiv = document.getElementById("fileDiv") as HTMLDivElement;
const confirmDiv = document.getElementById("confirmDiv") as HTMLDivElement;
export const mainDiv = document.getElementById("mainDiv") as HTMLDivElement;
export const resultsDiv = document.getElementById("resultsDiv") as HTMLDivElement;

if (searchParams.has("quiz")) {
    fileDiv.setAttribute("style", "display: none;");
    loadDataFromUrl(searchParams.get("quiz")!);
}

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
            question.style = question.style ?? part.defaults?.style;
        }
    }

    currentQuiz = quiz;

    titleText.innerHTML = quiz.title;
    descriptionText.innerHTML = quiz.description ?? "";
    questionCountSpan.innerHTML = i18n.getTranslation("confirm.count").replace("{}", currentQuizQuestionCount.toString());
    confirmDiv.hidden = false;
}

function startQuiz() {
    if (currentQuiz != null) {
        if (currentQuiz.styleLink) {
            injectStyleFromUrl(currentQuiz.styleLink);
        }

        init();

        document.body.removeChild(fileDiv);
        document.body.removeChild(confirmDiv);
        mainDiv.hidden = false;
    }
}
