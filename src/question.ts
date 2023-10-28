import { data } from "./quiz-data.ts";

export abstract class QuizQuestion {
    readonly question: data.Question;
    readonly index: number;

    constructor(question: data.Question, index: number) {
        this.question = question;
        this.index = index;
    }

    public abstract setupHtml(): HTMLDivElement;
    public abstract isCorrect(): boolean;
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

            this.buttons[i] = button;
            div.appendChild(button);
        }

        return div;
    }

    public override isCorrect(): boolean {
        return this.selected.toString() == this.question.correctAnswer!;
    }
}

export abstract class QuizBooleanQuestion extends QuizQuestionWithOptions {
    public abstract falseText(): string;
    public abstract trueText(): string;

    constructor(question: data.Question, index: number) {
        super(question, index, 2);
    }

    public override textForOption(i: number): string {
        switch (i) {
            case 0:
                return this.falseText();
            case 1:
                return this.trueText();
            default:
                return "";
        }
    }
}

export class QuizYesOrNoQuestion extends QuizBooleanQuestion {
    public override falseText(): string {
        return "No";
    }

    public override trueText(): string {
        return "Yes";
    }
}

export class QuizTrueOrFalseQuestion extends QuizBooleanQuestion {
    public override falseText(): string {
        return "False";
    }

    public override trueText(): string {
        return "True";
    }
}

export class QuizMultipleChoiceQuestion extends QuizQuestionWithOptions {
    constructor(question: data.Question, index: number) {
        super(question, index, question.options!.length);
    }
}

export class QuizTextInputQuestion extends QuizQuestion {
    readonly matcher: RegExp;
    htmlInput: HTMLInputElement | undefined;
    input: string = "";

    constructor(question: data.Question, index: number) {
        super(question, index);
        this.matcher = new RegExp(question.correctAnswer!);
    }

    public setupHtml(): HTMLDivElement {
        const div = document.createElement("div");
        const input = document.createElement("input");

        input.type = "text";
        input.className = "question_input";
        input.id = `q${this.index}_input`;
        
        return div;
    }

    public isCorrect(): boolean {
        return this.matcher.test(this.input);
    }
}
