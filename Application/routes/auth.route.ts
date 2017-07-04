import { Router } from "express";
import * as passport from "passport";
import { IBaseAuthController } from "../controllers/base/base.auth.controller";
import { User } from "./../models/user.model";
import { ensureAuthenticated } from "./../utils/ensureAuthenticated";
import { IBaseRoute } from "./base/base.route";
export class AuthRoute implements IBaseRoute {
    public router: Router;
    public controller: IBaseAuthController<User>;
    constructor(controller: IBaseAuthController<User>) {
        this.controller = controller;
        this.router = Router();
        this.initRoutes();
    }
    public initRoutes() {
        this.router.get("/auth/login", (req, res) => {
            this.controller.getLogin(req, res);
        })
            .get("/auth/register", (req, res) => {
                this.controller.getRegister(req, res);
            })
            .post("/auth/login",
            passport.authenticate("local", {
                /* Allow flash/temporary variable */
                failureFlash: true,
                failureRedirect: "/auth/login",
            }), (req, res) => {
                this.controller.login(req, res);
            })
            .post("/auth/register", (req, res) => {
                this.controller.register(req, res);
            })
            .get("/auth/logout", ensureAuthenticated, (req, res) => {
                this.controller.logout(req, res);
            });
    }
    public getRouter() {
        return this.router;
    }
}
