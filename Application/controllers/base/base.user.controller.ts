export interface IBaseUserController<T> {
    getByUsername(req: any, res: any, next: any);
    getProfileSettings(req: any, res: any, next: any);
    setProfileImage(req: any, res: any, next: any);
    setProfileInfo(req: any, res: any, next: any);
}
