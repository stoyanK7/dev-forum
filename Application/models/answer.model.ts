import { User } from "./user.model";
export class Answer {
    public static toModel(obj: Answer): any {
        return {
            authorId: obj.authorId,
            date: obj.date,
            description: obj.description,
            dislikes: obj.dislikes,
            likes: obj.likes,
            votedFrom: obj.votedFrom,
        };
    }
    /* Recieves model from database and returns object */
    public static fromModel(model: any): Answer {
        const id = model.id || model._id;
        const description = model.description;
        const authorId = model.authorId;
        const date = model.date;
        const likes = model.likes;
        const dislikes = model.dislikes;
        const author = model.author;
        const votedFrom = model.votedFrom;
        return new Answer(id, description, authorId, author, date, likes, dislikes, votedFrom);
    }

    public id: string;
    public description: string;
    public authorId: string;
    public date: Date;
    public likes: number;
    public dislikes: number;
    public author: User;
    public votedFrom;

    constructor(id: string,
                description: string,
                authorId: string, author?, date?: Date, likes?: number, dislikes?: number, votedFrom?) {
        this.id = id;
        this.description = description;
        this.authorId = authorId;
        this.date = date || new Date();
        this.likes = likes || 0;
        this.dislikes = dislikes || 0;
        this.author = author;
        this.votedFrom = votedFrom || [];
    }
}
