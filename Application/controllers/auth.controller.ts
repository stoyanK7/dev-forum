import { IBaseData } from "../data/base/base.data";
import { ForumStats } from "../models/forum.stats.model";
import { User } from "../models/user.model";
import { Encryptor } from "./../utils/encryptor";
import { IBaseAuthController } from "./base/base.auth.controller";
const encryptor = new Encryptor();
export class AuthController implements IBaseAuthController<User> {
    public data: IBaseData<User>;
    public forumStatsData: IBaseData<ForumStats>;
    constructor(data: IBaseData<User>, forumStatsData: IBaseData<ForumStats>) {
        this.data = data;
        this.forumStatsData = forumStatsData;
    }
    /* Get login page */
    public getLogin(req, res) {
        const imageNumber = Math.floor((Math.random() * 10) + 1);
        return res.render("auth/login", { image: imageNumber });
    }
    /* Get register page */
    public getRegister(req, res) {
        const imageNumber = Math.floor((Math.random() * 10) + 1);
        return res.render("auth/register", { image: imageNumber });
    }
    /* Login */
    public login(req, res) {
        // redirect to user profile after login
        const username = req.user.username;
        return res.redirect("/user/" + username);
    }
    /* Register */
    public register(req, res) {
        const inputUsername = req.body.username;
        const inputPassword = req.body.password;
        const inputEmail = req.body.email;
        /* Check if email or username is already taken */
        this.data.findOne({ $or: [{ username: inputUsername }, { email: inputEmail }] })
            .then((user) => {
                if (user) {
                    req.flash("error", "Username/Email is already taken!");
                    return res.redirect("/auth/register");
                } else {
                    /* Check if inputs are not empty */
                    req.checkBody("username", "Name is required!").notEmpty();
                    req.checkBody("password", "Password is required!").notEmpty();
                    req.checkBody("email", "Email is required!").notEmpty();

                    const errors = req.validationErrors();

                    if (errors) {
                        const imageNumber = Math.floor((Math.random() * 10) + 1);
                        return res.render("auth/register", {
                            errors,
                            error_msg: "All fields are required!",
                            image: imageNumber,
                        });
                    } else {
                        /* Hash password */
                        const passwordHash = encryptor.encryptPassword(inputPassword);
                        const newUser = new User("", inputUsername, inputEmail, passwordHash);
                        /* Add user into database */
                        this.data.add(newUser);
                        /* Change forum stats */
                        this.forumStatsData.findOneAndUpdate({ id: "" }, {
                            $inc: { userCount: 1 },
                            $set: { newestUserUsername: inputUsername },
                        });
                        req.flash("success_msg", "You are registered and can now log in!");
                        return res.redirect("/auth/login");
                    }
                }
            });
    }
    /* Logout */
    public logout(req, res) {
        req.logOut();
        req.flash("success_msg", "You are logged out!");
        return res.redirect("/auth/login");
    }
}
