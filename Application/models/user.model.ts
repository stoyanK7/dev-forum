export class User {
    public static toModel(obj: User): any {
        return {
            answers: obj.answers,
            email: obj.email,
            firstName: obj.firstName,
            forumPoints: obj.forumPoints,
            hasProfileImage: obj.hasProfileImage,
            id: obj.id,
            joined: obj.joined,
            languages: obj.languages,
            lastName: obj.lastName,
            location: obj.location,
            password: obj.password,
            profileImagePath: obj.profileImagePath,
            username: obj.username,
        };
    }
    /* Recieves model from database and returns object */
    public static fromModel(model: any): User {
        const id = model.id || model._id;
        const username = model.username;
        const email = model.email;
        const password = model.password;
        const joined = model.joined;
        const hasProfileImage = model.hasProfileImage;
        const firstName = model.firstName;
        const lastName = model.lastName;
        const location = model.location;
        const languages = model.languages;
        const forumPoints = model.forumPoints;
        const answers = model.answers;
        return new User(id, username, email, password,
            joined, hasProfileImage, firstName, lastName, location, languages, forumPoints, answers);
    }

    public id: string;
    public email: string;
    public username: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public location: string;
    public languages: string;
    public readonly joined: Date;
    public forumPoints: number;
    public answers: number;
    public profileImagePath: string;
    public hasProfileImage: boolean;

    constructor(id: string,
                username: string,
                email: string,
                password: string,
                joined?,
                hasProfileImage?: boolean,
                firstName?: string,
                lastName?: string,
                location?: string,
                languages?: string,
                forumPoints?: number, answers?: number) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName || "Not set";
        this.lastName = lastName || "Not set";
        this.location = location || "Not set";
        this.languages = languages || "Not set";
        this.joined = joined || new Date();
        this.profileImagePath = "/assets/images/user/defaultProfileImage.png";
        this.forumPoints = forumPoints || 0;
        this.answers = answers || 0;
        this.hasProfileImage = hasProfileImage || false;
    }
}
