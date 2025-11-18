import express from "express";
import projectController from "../controllers/projectController.js";
import verifyUser from "../middleware/verifyUser.js";
import validateProject from "../middleware/validateProject.js";

const router = express.Router();

const accessToken = verifyUser.verifyAccessToken;
const validateData = validateProject.validateProjectData;
const validateUsersProject = validateProject.validateUsersProjectData

router.get('/project', accessToken, validateUsersProject, projectController.readProject);

router.post('/project', accessToken, validateData, projectController.createNewProject);

router.put('/project', accessToken, validateUsersProject, projectController.updateProject);

router.delete('/project', accessToken, validateUsersProject, projectController.deleteProject);

export default router;