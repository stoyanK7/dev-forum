import { Router } from "express";
import { IBaseUserController } from "../controllers/base/base.user.controller";
import { User } from "./../models/user.model";
import { ensureAuthenticated } from "./../utils/ensureAuthenticated";
import { upload } from "./../utils/multer";
import { IBaseRoute } from "./base/base.route";
export class UserRoute implements IBaseRoute {
    public router: Router;
    public controller: IBaseUserController<User>;
    constructor(controller: IBaseUserController<User>) {
        this.controller = controller;
        this.router = Router();
        this.initRoutes();
    }
    public initRoutes() {
        this.router
            .get("/user/settings", ensureAuthenticated, (req, res, next) => {
                this.controller.getProfileSettings(req, res, next);
            })
            .post("/user/settings/profileImage",
            ensureAuthenticated,
            upload,
            (req, res, next) => {
                this.controller.setProfileImage(req, res, next);
            })
            .post("/user/settings/info", ensureAuthenticated, (req, res, next) => {
                this.controller.setProfileInfo(req, res, next);
            })
            .get("/user/:username", ensureAuthenticated, (req, res, next) => {
                this.controller.getByUsername(req, res, next);
            });
    }
    public getRouter() {
        return this.router;
    }
}
