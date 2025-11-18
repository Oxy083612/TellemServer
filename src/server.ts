import express from "express";
const app = express();
const PORT = 3000;

// parsowanie plików json
app.use(express.json());

// uruchamianie routera
import authRouter from "./routes/auth.js";
app.use('/', authRouter);

import projectRouter from "./routes/projects.js"
app.use('/', projectRouter);

// uruchomienie serwera
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;