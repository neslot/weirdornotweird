import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/weird-or-not', async (req, res) => {
  try {
    const scenario = req.body.scenario;
    const openaiResponse = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt: `Hi,

I'd like to play a game with you called weird or not weird. As part of the game i will give you a scenario below, and I want you to choose weird or not weird. Be decisive and have fun. If you have a relevant dark or politically incorrect joke to the {scenario} please include it. 

Your response format must be:
That's [Weird] or [Not weird]
[Reason for weird or not weird]

[Joke if related to scenario]

Do not include the words 'Joke:'

Scenario: ${scenario}.

Please keep in mind that the user is Australian with Australian cultural values`,
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      },
    });

    const result = openaiResponse.data.choices[0].text.trim();
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
