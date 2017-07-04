export interface IBaseAuthController<T> {
    getLogin(req: any, res: any);
    getRegister(req: any, res: any);
    login(req: any, res: any);
    register(req: any, res: any);
    logout(req: any, res: any);
}
