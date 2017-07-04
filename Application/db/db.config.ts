import { Db, MongoClient } from "mongodb";
export class DbConfig {
    public static initMongoDb(connectionString: string): Promise<Db> {
        return MongoClient.connect(connectionString);
    }
}
