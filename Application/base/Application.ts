import { IBaseRoute } from "../routes/base/base.route";
export interface IApplication {
    start(port: number | string);
    addRoute(route: IBaseRoute);
    set(key: string, value: any);
    useMiddleware(middleware: any);
}
