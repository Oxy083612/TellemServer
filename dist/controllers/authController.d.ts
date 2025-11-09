import type { Response, Request } from "express";
interface Message {
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
}
interface TokenRequest {
    token: string;
}
interface CredRequest {
    login: string;
    password: string;
    email?: string;
}
declare function communicate(req: Request, res: Response<Message>): Promise<void>;
declare function refresh(req: Request, res: Response<Message>): Promise<Response<Message, Record<string, any>>>;
declare function loginToken(req: Request<TokenRequest>, res: Response<Message>): Promise<Response<Message, Record<string, any>>>;
declare function verify(req: Request<TokenRequest>, res: Response<Message>): Promise<Response<Message, Record<string, any>> | undefined>;
declare function login(req: Request<CredRequest>, res: Response<Message>): Promise<Response<Message, Record<string, any>>>;
declare function register(req: Request<CredRequest>, res: Response<Message>): Promise<Response<Message, Record<string, any>>>;
declare const _default: {
    communicate: typeof communicate;
    refresh: typeof refresh;
    loginToken: typeof loginToken;
    verify: typeof verify;
    login: typeof login;
    register: typeof register;
};
export default _default;
//# sourceMappingURL=authController.d.ts.map