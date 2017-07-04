import { Router } from "express";
import { IBaseCategoryController } from "../controllers/base/base.category.controller";
import { Category } from "./../models/category.model";
import { ensureAuthenticated } from "./../utils/ensureAuthenticated";
import { IBaseRoute } from "./base/base.route";
export class CategoryRoute implements IBaseRoute {
    public router: Router;
    public controller: IBaseCategoryController<Category>;
    constructor(controller: IBaseCategoryController<Category>) {
        this.controller = controller;
        this.router = Router();
        this.initRoutes();
    }
    public initRoutes() {
        this.router
            .get("/forum", (req, res, next) => {
                this.controller.getAll(req, res, next);
            });
    }
    public getRouter() {
        return this.router;
    }
}
