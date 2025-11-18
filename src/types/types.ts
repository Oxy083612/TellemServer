import "express";

interface Project {
    id?: number,
    name: string,
    description?: string,
    password?: string,   
}

declare global {
    namespace Express {
        interface Request {
            uID?: number,
            pID?: number,
            project?: Project,
        }
    }
}