import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
('url');
const port = process.env.PORT;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Server is running on port ${port}`));
