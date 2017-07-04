import * as express from "express";
import * as path from "path";
import { IApplication } from "./base/Application";
import { IBaseData } from "./data/base/base.data";
import { IBaseRoute } from "./routes/base/base.route";

export class ExpressApplication implements IApplication {
    private app: express.Application;
    constructor() {
        this.app = express();
        // serve static files
        this.app.use("/assets", express.static(path.join(__dirname, "assets")));
    }
    public start(port: number | string): Promise<{}> {
        port = +port;
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve();
            });
        });
    }
    public addRoute(route: IBaseRoute) {
        const router = route.getRouter();
        this.app.use(router);
    }
    public set(key: string, value: any) {
        this.app.set(key, value);
    }
    public useMiddleware(middleware: any) {
        this.app.use(middleware);
    }
}
