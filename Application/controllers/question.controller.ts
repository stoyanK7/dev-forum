import * as express from "express";
import { ObjectID } from "mongodb";
import { IBaseData } from "../data/base/base.data";
import { Answer } from "../models/answer.model";
import { Category } from "../models/category.model";
import { ForumStats } from "../models/forum.stats.model";
import { Question } from "../models/question.model";
import { User } from "../models/user.model";
import { catName } from "./../utils/category.name";
import { IBaseQuestionController } from "./base/base.question.controller";
export class QuestionController implements IBaseQuestionController<Question> {
    public data: IBaseData<Question>;
    public usersData: IBaseData<User>;
    public forumStatsData: IBaseData<ForumStats>;
    public categoriesData: IBaseData<Category>;
    constructor(data: IBaseData<Question>,
                usersData: IBaseData<User>,
                forumStatsData: IBaseData<ForumStats>,
                categoriesData: IBaseData<Category>) {
        this.data = data;
        this.usersData = usersData;
        this.forumStatsData = forumStatsData;
        this.categoriesData = categoriesData;
    }
    /* Get "Ask question" page */
    public getAskQuestion(req, res) {
        return res.render("forum/askQuestion");
    }
    /* Ask question */
    public askQuestion(req, res) {
        const body = req.body;
        const question = body.question;
        const description = body.desc;
        const category = body.category;
        const tags = body.tags.split(" ");
        const authorId = req.user.id;
        const author = req.user.username;
        /* Insert the new question */
        const newQuestion = new Question("", question, description, author, authorId, category);
        /* Update Forum Statistics fields */
        this.usersData.findOneAndUpdate({ _id: authorId }, { $inc: { forumPoints: 2 } });
        this.categoriesData.findOneAndUpdate({ name: category }, { $inc: { topics: 1 } });
        this.categoriesData.findOneAndUpdate({ name: category },
            { $set: { lastPostUserUsername: author, lastPostDate: new Date() } });
        this.data.add(newQuestion)
            /* Redirect to the page of the new question */
            .then((recievedQuestion) => {
                return res.redirect("/forum/category/" + newQuestion.category.toLowerCase());
            });
    }
    /* Get specific category page */
    public getCategory(req: any, res: any, next: any) {
        const category = req.params.category;
        const cat: string = catName(category);
        const queryCat = category.toUpperCase();
        const query = { category: queryCat };
        /* Get all topics with the given category from DB */
        this.data.find(query)
            .then((topics) => {
                /* Render view */
                return res.render("forum/forumCategory", {
                    topics,
                    cat,
                });
            });
    }
    /* Get specific question/topic by id */
    public getQuestion(req: any, res: any, next: any) {
        /* Get question ID */
        const questionId = req.params.questionId;
        let mainQuestion;
        let mainAuthor;
        let answers;
        /* Get question by id from DB */
        this.data.getById(questionId)
            .then((question) => {
                mainQuestion = question;
                answers = mainQuestion.answers;
                const cat = catName(mainQuestion.category);
                /* Get the author of the question by id from DB */
                return this.usersData.getById(question.authorId);
            })
            .then((author) => {
                mainAuthor = author;

                const repliesArray = [];
                const cat = catName(mainQuestion.category);
                /* If there are replies to the question/topic */
                if (answers.length > 0) {
                    return answers.forEach((answer) => {
                        /* Get the authors of the replies to the topic/question */
                        this.usersData.findOne({ _id: answer.authorId })
                            .then((replyAuthor) => {
                                const newAnswer = new Answer(answer.id, answer, "", replyAuthor, answer.date);
                                repliesArray.push(newAnswer);
                                /* When forEach finishes */
                                if (repliesArray.length === answers.length) {
                                    this.data.findOneAndUpdate({ _id: mainQuestion.id }, { $inc: { views: 1 } });
                                    /* Sort replies by date */
                                    repliesArray.sort((a, b) => {
                                        return a.date.getTime() - b.date.getTime();
                                    });
                                    return res.render("forum/forumTopic", {
                                        mainQuestion,
                                        mainAuthor,
                                        replies: repliesArray,
                                        cat,
                                    });
                                }
                            });
                    });
                }
                /* If there arent replies */
                this.data.findOneAndUpdate({ _id: mainQuestion.id }, { $inc: { views: 1 } });
                /* Render view */
                return res.render("forum/forumTopic", {
                    mainQuestion,
                    mainAuthor,
                    cat,
                });
            });
    }
    /* Send answer/reply to question/topic */
    public answer(req: any, res: any, next: any) {
        const questionId = new ObjectID(req.params.questionId);
        const description = req.body.desc;
        const userId = req.user.id;
        const newAnswer = new Answer("", description, userId);
        const query = { _id: questionId };
        const category = req.body.category;
        this.categoriesData.findOneAndUpdate({ name: category }, { $inc: { posts: 1 } });
        this.forumStatsData.findOneAndUpdate({ id: "" }, { $inc: { repliesCount: 1 } });
        this.data.findOneAndUpdate(query, { $inc: { answersCount: 1 } });
        this.usersData.findOneAndUpdate({ _id: userId }, { $inc: { forumPoints: 1, answers: 1 } });
        this.data.findOneAndUpdate(query, { $push: { answers: newAnswer } })
            .then(() => {
                res.redirect("/forum/topics/" + questionId);
            });
    }
    /* Get index page */
    public getIndex(req: any, res: any, next: any) {
        let forumStats;
        const questionsWithoutAnswersArray = [];
        /* Find forum stats */
        this.forumStatsData.findOne({ id: "" })
            .then((found) => {
                forumStats = found;
            })
            .then(() => {
                /* Find all questions without answers */
                return this.data.find({ answersCount: 0 });
            })
            .then((questionsWithoutAnswers) => {
                /* Take only 5 */
                for (let i = 0; i <= 5; i++) {
                    if (questionsWithoutAnswers[i] === undefined) {
                        break;
                    }
                    questionsWithoutAnswersArray.push(questionsWithoutAnswers[i]);
                }
                /* Get the 3 questions with the most answers */
                return this.data.findSortLimit({ answersCount: -1 }, 3);
            })
            .then((hotQuestions) => {
                /* Render view */
                return res.render("index", {
                    questionsWithoutAnswersArray,
                    forumStats,
                    hotQuestions,
                });
            });
    }
}
