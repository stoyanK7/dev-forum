import { IBaseData } from "../data/base/base.data";
import { Category } from "../models/category.model";
import { IBaseCategoryController } from "./base/base.category.controller";
export class CategoryController implements IBaseCategoryController<Category> {
    public data: IBaseData<Category>;
    constructor(data: IBaseData<Category>) {
        this.data = data;
    }
    /* Get forum categories */
    public getAll(req: any, res: any, next: any) {
        this.data.getAll()
            .then((categoriesArray) => {
                return res.render("forum/forumCategories", {
                    categoriesArray,
                });
            });
    }
}
