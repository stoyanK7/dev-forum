export interface IModelFuncs<T> {
    toModel(obj: T): any;
    fromModel(model: any): T;
}
