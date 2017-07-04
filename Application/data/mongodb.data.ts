import { Collection, Db, ObjectID } from "mongodb";
import { IBaseData } from "./base/base.data";
import { IModelFuncs } from "./utils/model.funcs";

export class MongoDbData<T> implements IBaseData<T> {
    public db: Db;
    public collection;
    public modelFuncs: IModelFuncs<T>;
    constructor(db: Db, Klass: Function, modelFuncs: IModelFuncs<T>) {
        this.db = db;
        const collectionName = this.getCollectionName(Klass);
        this.collection = this.db.collection(collectionName);
        this.modelFuncs = modelFuncs;
    }
    public find(query?): Promise<T> {
        return this.collection.find(query)
            .toArray()
            .then((result) => {
                const arrayToReturn = result.map((item) => {
                    return this.modelFuncs.fromModel(item);
                });
                return arrayToReturn;
            });
    }
    /* Get all documents from collecion */
    public getAll(): Promise<T[]> {
        return this.collection.find()
            .toArray()
            .then((models) => {
                return models;
            });
    }
    public getById(id: string): Promise<T> {
        const objectId = new ObjectID(id);
        return this.collection.findOne({ _id: objectId })
            .then((model) => {
                return this.modelFuncs.fromModel(model);
            });
    }
    public add(item: T): Promise<T> {
        return this.collection.insertOne(item)
            .then((result) => {
                return result;
            });
    }
    public insertMany(items: object[]): Promise<T[]> {
        return this.collection.insertMany(items)
            .then((result) => {
                return result;
            });
    }
    public findOne(query?: any): Promise<T> {
        return this.collection.findOne(query)
            .then((model) => {
                if (model == null) {
                    return model;
                }
                return this.modelFuncs.fromModel(model);
            });
    }
    public findOneAndUpdate(query: any, newValue): Promise<T> {
        return this.collection.findOneAndUpdate(query, newValue)
            .then((result) => {
                return result;
            });
    }
    public update(query, newValues) {
        return this.collection.update(query, newValues)
            .then((result) => {
                return result;
            });
    }
    public findSortLimit(query: any, limit: number): Promise<T[]> {
        return this.collection.find().sort(query).limit(limit)
            .toArray()
            .then((result) => {
                const arrayToReturn = result.map((item) => {
                    return this.modelFuncs.fromModel(item);
                });
                return arrayToReturn;
            });
    }
    public remove(selector): Promise<T> {
        return this.collection.remove(selector)
            .then((result) => {
                return result;
            });
    }
    private getCollectionName(Klass: Function): string {
        const klassName = Klass.prototype.constructor.name;
        return klassName.toLowerCase() + "s";
    }
}
