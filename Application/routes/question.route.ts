import { Router } from "express";
import { IBaseCategoryController } from "../controllers/base/base.category.controller";
import { IBaseQuestionController } from "../controllers/base/base.question.controller";
import { Question } from "../models/question.model";
import { Category } from "./../models/category.model";
import { ensureAuthenticated } from "./../utils/ensureAuthenticated";
import { IBaseRoute } from "./base/base.route";
export class QuestionRoute implements IBaseRoute {
    public router: Router;
    public controller: IBaseQuestionController<Question>;
    constructor(controller: IBaseQuestionController<Question>) {
        this.controller = controller;
        this.router = Router();
        this.initRoutes();
    }
    public initRoutes() {
        this.router
            .get("/", (req, res, next) => {
                this.controller.getIndex(req, res, next);
            })
            .get("/forum/askQuestion", ensureAuthenticated, (req, res, next) => {
                this.controller.getAskQuestion(req, res, next);
            })
            .post("/forum/askQuestion", ensureAuthenticated, (req, res, next) => {
                this.controller.askQuestion(req, res, next);
            })
            .get("/forum/topics/:questionId", (req, res, next) => {
                this.controller.getQuestion(req, res, next);
            })
            .get("/forum/category/:category", ensureAuthenticated, (req, res, next) => {
                this.controller.getCategory(req, res, next);
            })
            .post("/forum/topics/:questionId", ensureAuthenticated, (req, res, next) => {
                this.controller.answer(req, res, next);
            });
    }
    public getRouter() {
        return this.router;
    }
}
