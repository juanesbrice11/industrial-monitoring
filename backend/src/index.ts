import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { setupRoutes } from './routes/index.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

setupRoutes(app);

// Manejo de rutas no encontradas
app.use(notFound);

// Manejo global de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
