import * as bcrypt from "bcryptjs";
export class Encryptor {
    /* Hash password */
    public encryptPassword(passwordToHash: string): string {
        const salt = bcrypt.genSaltSync(10);
        const hashToSave: string = bcrypt.hashSync(passwordToHash, salt);
        return hashToSave;
    }
    /* Compare hash and given password */
    public comparePasswords(candidatePassword: string, hash: string): boolean {
        const result: boolean = bcrypt.compareSync(candidatePassword, hash);
        return result;
    }
}
