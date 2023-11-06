import * as i18n from "./i18n.ts";
import { data } from "./quiz-data.ts";

export abstract class QuizQuestion {
    readonly question: data.Question;
    readonly index: number;
    matcher: RegExp | undefined;

    constructor(question: data.Question, index: number) {
        this.question = question;
        this.index = index;
    }

    public abstract setupHtml(): HTMLDivElement;
    public abstract getCurrentAnswer(): string;
    public abstract getClassName(): string;

    public isCorrect(): boolean {
        return this.matcher?.test(this.getCurrentAnswer()) ?? false;
    }

    public getCorrectAnswerDisplay(): string | undefined {
        return undefined;
    }

    public getCurrentAnswerDisplay(): string | undefined {
        return undefined;
    }
}

export abstract class QuizQuestionWithOptions extends QuizQuestion {
    buttons: HTMLButtonElement[];
    selected: number = 0;
    readonly optionCount: number;

    constructor(question: data.Question, index: number, optionCount: number) {
        super(question, index);
        this.buttons = new Array(optionCount);
        this.optionCount = optionCount;
    }

    public textForOption(i: number): string {
        return this.question.options![i];
    }

    public override setupHtml(): HTMLDivElement {
        const div = document.createElement("div");

        for (let i = 0; i < this.optionCount; i++) {
            let button = document.createElement("button");
            
            button.innerHTML = this.textForOption(i);
            button.className = "question_button";
            button.id = `q${this.index}_button_${i}`;

            button.onclick = () => {
                if (this.selected > 0) {
                    this.buttons[this.selected - 1].className = "question_button";
                }
                this.selected = i + 1;
                button.className = "question_button_selected";
            };

            this.buttons[i] = button;
            div.appendChild(button);
        }

        return div;
    }

    public getCurrentAnswer(): string {
        return this.selected == 0 ? "" : this.selected.toString();
    }
}

export abstract class QuizBooleanQuestion extends QuizQuestionWithOptions {
    public abstract falseText(): string;
    public abstract trueText(): string;

    constructor(question: data.Question, index: number) {
        super(question, index, 2);
        this.matcher = new RegExp(question.correctAnswer!.toString());
    }

    public override textForOption(i: number): string {
        switch (i) {
            case 0:
                return this.trueText();
            case 1:
                return this.falseText();
            default:
                return "";
        }
    }

    public getCurrentAnswer(): string {
        if (this.selected < 1 || this.selected > 2) {
            return ""
        }
        return this.selected == 1 ? "true" : "false";
    }

    public getClassName(): string {
        return "boolean";
    }

    public override getCorrectAnswerDisplay(): string | undefined {
        return this.question.correctAnswer == "true" ? this.trueText() : this.falseText();
    }

    public override getCurrentAnswerDisplay(): string | undefined {
        if (this.selected == 1) {
            return this.trueText();
        }
        else if (this.selected == 2) {
            return this.falseText();
        }
        else {
            return "";
        }
    }
}

export class QuizYesOrNoQuestion extends QuizBooleanQuestion {
    public override falseText(): string {
        return i18n.getTranslation("question.no");
    }

    public override trueText(): string {
        return i18n.getTranslation("question.yes");
    }
}

export class QuizTrueOrFalseQuestion extends QuizBooleanQuestion {
    public override falseText(): string {
        return i18n.getTranslation("question.true");
    }

    public override trueText(): string {
        return i18n.getTranslation("question.false");
    }
}

export class QuizMultipleChoiceQuestion extends QuizQuestionWithOptions {
    constructor(question: data.Question, index: number) {
        super(question, index, question.options!.length);
        this.matcher = new RegExp(question.correctAnswer!);
    }

    public getClassName(): string {
        return "multiple_choice";
    }

    public override getCorrectAnswerDisplay(): string | undefined {
        return this.question.options![Number.parseInt(this.question.correctAnswer!) - 1];
    }

    public override getCurrentAnswerDisplay(): string | undefined {
        return this.selected > 0 ? this.question.options![this.selected - 1] : "";
    }
}

export class QuizTextInputQuestion extends QuizQuestion {
    readonly matcher: RegExp;
    input: HTMLInputElement | undefined;

    constructor(question: data.Question, index: number) {
        super(question, index);
        this.matcher = new RegExp(question.correctAnswer!);
    }

    public setupHtml(): HTMLDivElement {
        const div = document.createElement("div");
        this.input = document.createElement("input");

        this.input.type = "text";
        this.input.className = "question_input";
        this.input.id = `q${this.index}_input`;
        this.input.setAttribute("autocomplete", "off");

        div.appendChild(this.input);
        
        return div;
    }

    public getCurrentAnswer(): string {
        return this.input?.value ?? "";
    }

    public getClassName(): string {
        return "text_input";
    }
}
