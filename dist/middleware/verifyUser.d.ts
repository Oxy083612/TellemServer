import type { Response, Request, NextFunction } from "express";
export declare enum CredType {
    CredLogin = 0,
    CredRegister = 1
}
declare function verifyCredentials(type: CredType): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    verifyAccessToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    verifyRefreshToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    verifyVerificationToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    verifyCredentials: typeof verifyCredentials;
    verifyLogin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    verifyRegister: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;
//# sourceMappingURL=verifyUser.d.ts.map