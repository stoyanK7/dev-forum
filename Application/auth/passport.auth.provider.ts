import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as passport from "passport";
import { Strategy } from "passport-local";
import { IApplication } from "../base/Application";
import { IBaseData } from "../data/base/base.data";
import { User } from "../models/user.model";
import { Encryptor } from "./../utils/encryptor";
import { IBaseAuthProvider } from "./base/base.auth.provider";
const encryptor = new Encryptor();
export class PassportAuthProvider implements IBaseAuthProvider {
    public data: IBaseData<User>;
    public secret: string;
    constructor(data: IBaseData<User>, secret: string) {
        this.data = data;
        this.secret = secret;
    }
    public addToApp(app: IApplication) {
        app.useMiddleware(bodyParser.json());
        app.useMiddleware(bodyParser.urlencoded({ extended: true }));
        app.useMiddleware(cookieParser());
        app.useMiddleware(session({
            /* 15 minutes cookie max age */
            cookie: { maxAge: 1000 * 60 * 15 },
            /* Refresh cookie */
            resave: true,
            /* Save all new tokens */
            saveUninitialized: true,
            /* Sign session ID cookie */
            secret: this.secret,
        }));
        app.useMiddleware(passport.initialize());
        app.useMiddleware(passport.session());

        /* Initialize passport local strategy */
        passport.use(new Strategy((username: string, password: string, done) => {
            /* Search user by username */
            this.data.findOne({ username })
                .then((user) => {
                    /* Username vaalidation */
                    if (!user) {
                        return done(null, false, { message: "Unknown user!" });
                    }
                    /* Compare given password from client and hash from database */
                    const passwordsMatch: boolean = encryptor.comparePasswords(password, user.password);
                    /* Password validation */
                    if (passwordsMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Invalid password!" });
                    }
                })
                /* Catch an error if there is any */
                .catch((err) => {
                    done(err);
                });
        }));

        /* Gets user and returns him */
        passport.serializeUser((user: User, done) => {
            done(null, user.id);
        });
        /* Find user by given id */
        passport.deserializeUser((id: string, done) => {
            this.data.getById(id)
                .then((user) => { done(null, user); })
                .catch((err) => { done(err); });
        });
    }
}
