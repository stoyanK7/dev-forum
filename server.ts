import * as bodyParser from "body-parser";
import * as mime from "mime";
import * as multer from "multer";
import * as path from "path";
import { IBaseAuthProvider } from "./Application/auth/base/base.auth.provider";
import { PassportAuthProvider } from "./Application/auth/passport.auth.provider";
import { IApplication } from "./Application/base/Application";
import { connectionString, port, secret } from "./Application/config";
import { AuthController } from "./Application/controllers/auth.controller";
import { IBaseAuthController } from "./Application/controllers/base/base.auth.controller";
import { IBaseCategoryController } from "./Application/controllers/base/base.category.controller";
import { IBaseQuestionController } from "./Application/controllers/base/base.question.controller";
import { IBaseUserController } from "./Application/controllers/base/base.user.controller";
import { CategoryController } from "./Application/controllers/category.controller";
import { QuestionController } from "./Application/controllers/question.controller";
import { UserController } from "./Application/controllers/user.controller";
import { IBaseData } from "./Application/data/base/base.data";
import { MongoDbData } from "./Application/data/mongodb.data";
import { DbConfig } from "./Application/db";
import { ExpressApplication } from "./Application/ExpressApplication";
import { Category } from "./Application/models/category.model";
import { ForumStats } from "./Application/models/forum.stats.model";
import { Question } from "./Application/models/question.model";
import { User } from "./Application/models/user.model";
import { AuthRoute } from "./Application/routes/auth.route";
import { CategoryRoute } from "./Application/routes/category.route";
import { QuestionRoute } from "./Application/routes/question.route";
import { UserRoute } from "./Application/routes/user.route";
import { errorFormatter } from "./Application/utils/error.formatter";
import { flashConfiguration } from "./Application/utils/flashConfiguration";
import expressValidator = require("express-validator");
import flash = require("connect-flash");

let app: IApplication;
let db;
let usersData: IBaseData<User>;
let categoriesData: IBaseData<Category>;
let questionsData: IBaseData<Question>;
let forumStatsData: IBaseData<ForumStats>;
let authController: IBaseAuthController<User>;
let userController: IBaseUserController<User>;
let categoriesController: IBaseCategoryController<Category>;
let questionController: IBaseQuestionController<Question>;
let authProvider: IBaseAuthProvider;

DbConfig.initMongoDb(connectionString)
    /* Init */
    .then((dbInstance) => {
        db = dbInstance;
        usersData = new MongoDbData<User>(db, User, User);
        categoriesData = new MongoDbData<Category>(db, Category, Category);
        questionsData = new MongoDbData<Question>(db, Question, Question);
        forumStatsData = new MongoDbData<ForumStats>(db, ForumStats, ForumStats);
        app = new ExpressApplication();
    })
    /* Set view engine and views dir */
    .then(() => {
        app.set("view engine", "pug");
        app.set("views", path.join(__dirname, "Application", "views"));
    })
    /* Add auth */
    .then(() => {
        authProvider = new PassportAuthProvider(usersData, secret);
        authProvider.addToApp(app);
    })
    /* Add middlewares */
    .then(() => {
        app.useMiddleware(bodyParser.json());
        app.useMiddleware(bodyParser.urlencoded({ extended: true }));
        app.useMiddleware(expressValidator({ errorFormatter }));
        app.useMiddleware(flash());
        app.useMiddleware(flashConfiguration);
    })
    /* Init controllers */
    .then(() => {
        authController = new AuthController(usersData, forumStatsData);
        userController = new UserController(usersData);
        categoriesController = new CategoryController(categoriesData);
        questionController = new QuestionController(questionsData, usersData, forumStatsData, categoriesData);
    })
    /* Add routes */
    .then(() => {
        const authRoute = new AuthRoute(authController);
        app.addRoute(authRoute);
        const userRoute = new UserRoute(userController);
        app.addRoute(userRoute);
        const categoryRoute = new CategoryRoute(categoriesController);
        app.addRoute(categoryRoute);
        const questionRoute = new QuestionRoute(questionController);
        app.addRoute(questionRoute);
    })
    /* Start application */
    .then(() => {
        return app.start(port);
    })
    /* 404 handler */
    .then(() => {
        app.useMiddleware((req, res, next) => {
            res.status(404).render("404");
        });
    })
    .then(() => {
        // tslint:disable-next-line:no-console
        console.log(`Server running at : ${port}`);
    });
