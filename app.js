require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const api = require('./modules/api');
const app = express();
app.use(express.json());

const cors = require('cors');

const port = process.env.PORT;

const recordSchema = new mongoose.Schema({
    word: String, // Use appropriate fields and types for your data
    translation: String
});


mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected successfully to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });


app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.options('/api/translate', cors());

app.post('/api/translate', cors(), async (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const Record = mongoose.model('Record', recordSchema, `${from}-${to}`);
    const word = req.body.word;
    const cachedResult = await Record.find({ word: word });
    if (cachedResult.length === 0) {
        const response = await api.submitData(from, to, word);
        res.json({ data: { word: word, translation: response } });

        const newRecordData = { word: word, translation: response };
        const newRecord = new Record(newRecordData);
        const savedRecord = await newRecord.save();
        console.log(savedRecord);
    } else {
        res.json({ data: cachedResult[0] });
    }

});

app.post('/api/getaudio', cors(), async (req, res) => {
    const word = req.body.word;
    if (!word) {
        return res.status(400).json({ error: 'Word is required' });
    }

    try {
        const mp3 = await api.getAudio(word);
        const buffer = Buffer.from(await mp3.arrayBuffer());
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(buffer);
    } catch (error) {
        console.error('Error fetching audio:', error);
        res.status(500).json({ error: 'Failed to fetch audio!!!' });
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
