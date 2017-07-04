export class Category {
    public static toModel(obj: Category): any {
        return {
            lastPostUserUsername: obj.lastPostUserUsername,
            name: obj.name,
            posts: obj.posts,
            showName: obj.showName,
            topics: obj.topics,
        };
    }
    /* Recieves model from database and returns object */
    public static fromModel(model: any): Category {
        const id = model.id || model._id;
        const name = model.name;
        const topics = model.topics;
        const posts = model.posts;
        const lastPostUserUsername = model.lastPostUserUsername;
        const showName = model.showName;
        const lastPostDate = model.lastPostDate;
        return new Category(id, name, showName, topics, posts, lastPostUserUsername,lastPostDate);
    }

    public id: string;
    public name: string;
    public showName: string;
    public topics: number;
    public posts: number;
    public lastPostUserUsername;
    public lastPostDate: Date;

    constructor(id: string,
                name: string,
                showName: string, topics?: number, posts?: number, lastPostUserUsername?, lastPostDate?: Date) {
        this.id = id;
        this.name = name;
        this.showName = showName;
        this.topics = topics || 0;
        this.posts = posts || 0;
        this.lastPostUserUsername = lastPostUserUsername || "No authors yet";
        this.lastPostDate = lastPostDate || new Date();
    }
}
