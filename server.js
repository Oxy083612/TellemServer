const express = require('express');
const app = express();
const PORT = 3000;

// parsowanie plików json
app.use(express.json());

// uruchamianie routera
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// uruchomienie serwera
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;