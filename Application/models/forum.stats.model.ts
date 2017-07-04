export class ForumStats {
    public static toModel(obj: ForumStats): any {
        return {
            newestUserUsername: obj.newestUserUsername,
            repliesCount: obj.repliesCount,
            topicsCount: obj.topicsCount,
            userCount: obj.userCount,
        };
    }
   /* Recieves model from database and returns object */
    public static fromModel(model: any): ForumStats {
        const id = model.id || model._id;
        const userCount = model.userCount;
        const topicsCount = model.topicsCount;
        const repliesCount = model.repliesCount;
        const newestUserUsername = model.newestUserUsername;
        return new ForumStats(id, userCount, topicsCount, repliesCount, newestUserUsername);
    }
    public id: string;
    public userCount: number;
    public topicsCount: number;
    public repliesCount: number;
    public newestUserUsername: string;
    constructor(id: string, userCount: number, topicsCount: number, repliesCount: number, newestUserUsername: string) {
        this.id = id;
        this.userCount = userCount;
        this.topicsCount = topicsCount;
        this.repliesCount = repliesCount;
        this.newestUserUsername = newestUserUsername;
    }
}
