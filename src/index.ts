import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.routes';
import patientRouter from './routes/patient.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/auth', authRouter);
app.use('/patients', patientRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'VitalSync Backend API funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Setup Swagger documentation
import { setupSwagger } from './swagger';
setupSwagger(app);

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Arquivo muito grande. Limite de 5MB.',
      data: null
    });
  }

  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Apenas arquivos de imagem são permitidos.',
      data: null
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    data: null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor VitalSync rodando na porta ${PORT}`);
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/api-docs`);
  console.log(`🏥 API disponível em http://localhost:${PORT}`);
});