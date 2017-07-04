export interface IBaseData<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T>;
    add(item: T): Promise<T>;
    findOne(query?: any): Promise<T>;
    findOneAndUpdate(query: any, item): Promise<T>;
    insertMany(items: object[]): Promise<T[]>;
    update(query, items): Promise<T[]>;
    find(query?: any): Promise<T>;
    findSortLimit(query: any, limit: number): Promise<T[]>;
    remove(selector): Promise<T>;
}
