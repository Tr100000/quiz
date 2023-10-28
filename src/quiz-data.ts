export namespace data {
    export interface QuizData {
        title: string;
        description: string | undefined;
        quiz: QuizPart[];
    }
    
    export interface QuizPart {
        randomizeQuestionOrder: boolean | undefined;
        defaults: Question | undefined;
        questions: Question[];
    }
    
    export interface Question {
        top_text: string | undefined;
        type: string | undefined;
        text: string | undefined;
        options: string[] | undefined;
        correctAnswer: string | undefined;
        correctAnswerDisplay: string | undefined;
    }
}
