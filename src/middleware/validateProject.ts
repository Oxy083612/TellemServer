import type { Response, Request, NextFunction } from "express";
import projectModel from "../models/projectModel.js";

interface Project {
    id?: number,
    name: string,
    description?: string,
    password?: string,   
}
// resolve password
async function validateProjectData(req: Request, res: Response, next: NextFunction) {
    const project = req.body as Project;
    if (!project.name){
        return res.status(400).send({
            success: false,
            message: "No project name added"
        })
    }
    if (!project.description){
        project.description = "No description added.";
    }
    next();
}  

// finding user by pID?
async function validateUsersProjectData(req: Request, res: Response, next: NextFunction){
    const uID = req.uID!;
    const pID = req.pID!;
    console.log("pID: " + pID + "\nuID: " + uID);
    try {            
        let project: Project | null = await projectModel.findProjectById(pID);
        if(!project){
            res.status(400).send({
                success: false,
                message: "No project found by given ID."
            });
        }
        let projects: Project[] | null = await projectModel.findUsersProjects(uID);

        const proj = projects?.find(proj => proj.id === pID);

        if (proj) {
            req.project = proj;
            return next();
        }

        res.status(400).send({
            success: false,
            message: "No users project found by given user ID and project ID."
        });

    } catch {
         res.status(500).send({ 
            success: false, 
            message: "Server error" });  
    }
}

export default {
    validateProjectData,
    validateUsersProjectData,
}