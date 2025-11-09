export declare enum TokenType {
    accessToken = 0,
    refreshToken = 1,
    verificationToken = 2
}
declare function createToken(uID: number, type: TokenType): string;
declare function encryptToken(token: string): Promise<string>;
declare const _default: {
    createToken: typeof createToken;
    encryptToken: typeof encryptToken;
};
export default _default;
//# sourceMappingURL=tokenLogic.d.ts.map