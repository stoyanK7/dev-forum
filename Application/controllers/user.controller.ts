import { IBaseData } from "../data/base/base.data";
import { User } from "../models/user.model";
import { IBaseUserController } from "./base/base.user.controller";
export class UserController implements IBaseUserController<User> {
    public data: IBaseData<User>;
    constructor(data: IBaseData<User>) {
        this.data = data;
    }
    /* Get user profile */
    public getByUsername(req, res, next) {
        const username = req.params.username;
        const user = this.data.findOne({ username })
            .then((foundUser) => {
                if (foundUser == null) {
                    return res.render("404");
                }
                /* Parse date into numbers */
                const dateJoined = foundUser.joined;
                const year = dateJoined.getFullYear();
                const month = dateJoined.getMonth() + 1;
                const day = dateJoined.getDate();
                const hour = dateJoined.getHours();
                const minutes = dateJoined.getMinutes();
                const joined = {
                    year,
                    month,
                    day,
                    minutes,
                    hour,
                };
                return res.render("user/userProfile", {
                    foundUser,
                    joined,
                });
            });
    }
    public getProfileSettings(req, res, next) {
        return res.render("user/userSettings");
    }
    public setProfileImage(req, res, next) {
        /* Change hasProfileImage field to true, so view engine uses new agatar */
        const query = { _id: req.user.id };
        const newValue = { $set: { hasProfileImage: true } };
        this.data.findOneAndUpdate(query, newValue);
        return res.redirect("/user/" + req.user.username);
    }
    public setProfileInfo(req, res, next) {
        const id = req.user.id;
        const body = req.body;
        const firstName = body.firstName;
        const lastName = body.lastName;
        const location = body.location;
        const email = body.email;
        const languages = body.languages;
        const newFields = {
            firstName,
            lastName,
            location,
            email,
            languages,
        };
        /* Update user fields by finding him by id */
        const query = { _id: id };
        this.data.findOneAndUpdate(query, { $set: newFields });
        return res.redirect("/user/" + req.user.username);
    }
    public getDeleteQuestions(req, res, next) {
        return res.render("user/deleteQuestions");
    }
}
