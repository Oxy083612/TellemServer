export interface User {
    id: number;
    email: string;
    password: string;
    is_verified: boolean;
}
declare function findUserByEmail(email: string): Promise<User | null>;
declare function findUserByUsername(username: string): Promise<User | null>;
declare function findUserById(uID: number): Promise<User | null>;
declare function findUserPassword(uID: number): Promise<string | null>;
declare function checkIfUserIsVerified(uID: number): Promise<boolean>;
declare function createUser(username: string, password: string, email: string): Promise<number>;
declare function deleteUser(uID?: number, username?: string, email?: string): Promise<boolean>;
declare function createVerificationToken(uID: number, verificationToken: string): Promise<void>;
declare function verifyUser(uID: number): Promise<void>;
declare function hashPassword(password: string): Promise<string>;
declare function verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
declare const _default: {
    findUserByEmail: typeof findUserByEmail;
    findUserByUsername: typeof findUserByUsername;
    findUserById: typeof findUserById;
    findUserPassword: typeof findUserPassword;
    createUser: typeof createUser;
    deleteUser: typeof deleteUser;
    verifyUser: typeof verifyUser;
    checkIfUserIsVerified: typeof checkIfUserIsVerified;
    createVerificationToken: typeof createVerificationToken;
    hashPassword: typeof hashPassword;
    verifyPassword: typeof verifyPassword;
};
export default _default;
//# sourceMappingURL=userModel.d.ts.map