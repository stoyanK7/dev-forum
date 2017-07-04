export interface IBaseQuestionController<T> {
    getAskQuestion(req: any, res: any, next: any);
    askQuestion(req: any, res: any, next: any);
    getCategory(req: any, res: any, next: any);
    getQuestion(req: any, res: any, next: any);
    answer(req: any, res: any, next: any);
    getIndex(req: any, res: any, next: any);
}
