import { Answer } from "./answer.model";
export class Question {
    public static toModel(obj: Question): any {
        return {
            answers: obj.answers,
            answersCount: obj.answersCount,
            author: obj.author,
            authorId: obj.authorId,
            category: obj.category,
            dateCreated: obj.dateCreated,
            description: obj.description,
            question: obj.question,
            views: obj.views,
        };
    }
    /* Recieves model from database and returns object */
    public static fromModel(model: any): Question {
        const id = model.id || model._id;
        const authorId = model.authorId;
        const question = model.question;
        const description = model.description;
        const dateCreated = model.dateCreated;
        const category = model.category;
        const answers = model.answers;
        const views = model.views;
        const author = model.author;
        const answersCount = model.answersCount;
        return new Question(id,
        question, description, author, authorId, category, dateCreated, answers, views, answersCount);
    }
    public id: string;
    public authorId: string;
    public question: string;
    public description: string;
    public dateCreated: Date;
    public category: string;
    public author: string;
    public answers: Answer[];
    public answersCount: number;
    public views: number;

    constructor(id: string, question: string, description: string, author: string,
                authorId: string,
                category: string, dateCreated?: Date, answers?: Answer[], views?: number, answersCount?: number) {
        this.id = id;
        this.question = question;
        this.description = description;
        this.category = category;
        this.answers = answers || [];
        this.dateCreated = dateCreated || new Date();
        this.views = views || 0;
        this.author = author;
        this.authorId = authorId;
        this.answersCount = answersCount || 0;
    }
}
