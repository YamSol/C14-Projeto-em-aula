import express from 'express';
import authRouter from './routes/auth.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Vital Sync Backend funcionando" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});