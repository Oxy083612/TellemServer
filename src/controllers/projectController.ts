import type { Response, Request } from "express";
import projectModel from "../models/projectModel.js";

interface Project {
    name: string,
    description?: string,
    password?: string,   
}

interface Message {
    success: boolean;
    message: string;
    project?: Project;
}


async function createNewProject(req: Request, res: Response<Message>) {
    console.log("CREATING NEW PROJECT");

    const project = req.body as Project;
    const uID = req.uID!;
    try {
        const newProject = await projectModel.createProject(project, uID);
        console.log("NOWY: " + newProject.name)
        if(newProject){
            res.status(200).send({
                success: true,
                message: "Successfully created project",
                project: newProject
            })
        } else {
            res.status(400).send({
                success: false,
                message: "Server error"
            })
        }
    } catch(err) {
        console.log(err)
        res.status(500).send({ 
            success: false, 
            message: "Server error" });  
    }
}

async function readProject(req: Request, res: Response<Message>) {
    console.log("READING PROJECT");
    
    const project = req.project!;

    return res.status(200).json({
        success: true,
        message: "Receiving project.",
        project: project
    })
}

async function updateProject(req: Request, res: Response<Message>) {

} 

async function deleteProject(req: Request, res: Response<Message>) {
    
}

export default {
    createNewProject,
    readProject,
    updateProject,
    deleteProject
}