export namespace data {
    export interface QuizData {
        title: string;
        description: string | undefined;
        quiz: QuizPart[];
    }
    
    export interface QuizPart {
        shuffle: boolean | undefined;
        defaults: Question | undefined;
        questions: Question[];
    }
    
    export interface Question {
        header: string | undefined;
        type: string | undefined;
        text: string | undefined;
        options: string[] | undefined;
        correctAnswer: string | undefined;
        correctAnswerDisplay: string | undefined;
        style: string | undefined;
    }
}
