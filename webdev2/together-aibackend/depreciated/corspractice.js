import express from 'express';
import cors from 'cors';

const app = express();

// Use CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
