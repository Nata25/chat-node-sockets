import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

import serveStatic from 'serve-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

app.use(serveStatic(path.join(__dirname, '../public')));

app.listen(PORT);
