import pool from "../config/db.js";
import userModel from "./userModel.js";
import projectModel from "./projectModel.js";

//add duplicate handler
async function addCollaboratorToProject(uID: number, pID: number): Promise<boolean> {
    if (await userModel.findUserById(uID) && await projectModel.findProjectById(pID)){  
        await pool.query(
            'INSERT INTO project_collab (project_id, user_id) VALUES (?, ?)', [pID, uID]
        );
        return true;
    }
    return false;
}

//returns User[]
async function findCollaborators(pID: number): Promise<null>{
    return null;
}