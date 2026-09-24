import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { connectDatabase } from './config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from './models.js';

const app = express();
const port = Number(process.env.PORT || 8000);

app.use(cors());
app.use(express.json());

const list = (model: typeof User, populatePaths: string[] = []) => async (_request: Request, response: Response) => {
  try {
    const query = model.find();
    populatePaths.forEach((path) => query.populate(path));
    response.json(await query.sort({ createdAt: -1 }));
  } catch (error) {
    response.status(500).json({ message: 'Unable to load records', error });
  }
};

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'octofit-tracker-api' }));
app.get('/api/users/', list(User, ['team']));
app.get('/api/teams/', list(Team, ['members']));
app.get('/api/activities/', list(Activity, ['user']));
app.get('/api/leaderboard/', async (_request, response) => {
  try {
    response.json(await Leaderboard.find().populate('user').sort({ rank: 1 }));
  } catch (error) {
    response.status(500).json({ message: 'Unable to load leaderboard', error });
  }
});
app.get('/api/workouts/', list(Workout));

app.post('/api/users/', async (request, response) => {
  try { response.status(201).json(await User.create(request.body)); }
  catch (error) { response.status(400).json({ message: 'Unable to create user', error }); }
});
app.post('/api/activities/', async (request, response) => {
  try { response.status(201).json(await Activity.create(request.body)); }
  catch (error) { response.status(400).json({ message: 'Unable to log activity', error }); }
});
app.post('/api/teams/', async (request, response) => {
  try { response.status(201).json(await Team.create(request.body)); }
  catch (error) { response.status(400).json({ message: 'Unable to create team', error }); }
});

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : `http://localhost:${port}`;

connectDatabase()
  .then(() => app.listen(port, () => console.log(`OctoFit API running at ${baseUrl}`)))
  .catch((error) => {
    console.error('Unable to connect to MongoDB:', error);
    process.exit(1);
  });

export default app;