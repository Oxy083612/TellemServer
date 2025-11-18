import pool from "../config/db.js";

interface Project {
    id?: number;
    name: string,
    description?: string,
    password?: string,   
}

// READ FUNCTIONS

async function findProjectById(pID: number): Promise<Project | null>{
    const [rows] = await pool.query('SELECT * FROM project WHERE id = ?', [pID]);
    const project = rows as Project[];
    return project.at(0) ?? null;
}

async function findUsersProjects(uID: number): Promise<Project[]>{
    const [rows] = await pool.query(
        'SELECT project.* FROM project JOIN project_collab ON project.id = project_collab.project_id WHERE project_collab.user_id = ?', [uID]
    );
    return rows as Project[];
}

// UPDATE
async function updateProject(pID: number, name?: string, description?: string): Promise<Project | null>{
    let project: Project | null = await findProjectById(pID);

    if (project){
        return null;
    }

    if(name && name.length > 0){
        await pool.query(
            'UPDATE project SET name = ? WHERE id = ?', [name, pID]
        );
    }

    if (description){
        await pool.query(
            'UPDATE project SET description = ? WHERE id = ?', [description, pID]
        );
    }
    
    project = await findProjectById(pID);

    return project;
}

// CREATE FUNCTIONS

async function createProject(project: Project, uID: number): Promise<Project>{
    console.log("PRZED STWORZENIEM: " + project + "\nuID: " + uID)
    
    const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result]: any = await pool.query(
        'INSERT INTO project (name, description, create_date) VALUES (?, ?, ?)', 
        [project.name, project.description, time]
    );

    const pID = result.insertId;
    console.log("pID: " + pID)
    await pool.query(
        'INSERT INTO project_collab (user_id, project_id) VALUES (?, ?)',
        [ uID, pID]
    );

    const newProject = await findProjectById(pID)!;


    if(!newProject){
        throw new Error("Created project not found in database.");
    }

    return newProject;
}

// DELETE FUNCTIONS

async function deleteProject(pID: number): Promise<void> {
    await pool.query('DELETE FROM project WHERE id = ?', pID);
}

export default {
    findProjectById,
    findUsersProjects,
    updateProject,
    createProject,
    deleteProject
}