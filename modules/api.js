

const submitData = async (from, to, userInput) => {
    try {
        const response = await fetch(process.env.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `you are an ${from} dictionary, when I input an ${from} word or expression, you tell me the pronunciation, ${to} translation, and meaning and sample sentences of this word.` },
                    { role: "user", content: userInput }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};


const getAudio = async (word) => {
    try {

        const response = await fetch(process.env.OPENAI_TTS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "tts-1",
                input: word,
                voice: "alloy",
                response_format: "opus"
            })
        });

        return response;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

const { GoogleAuth } = require('google-auth-library');
const keyFile = 'google-key-file.json';
const auth = new GoogleAuth({
    keyFile,
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
});


const getGoogleCloudAudio = async (languageCode, text) => {
    try {
        const client = await auth.getClient();
        const url = 'https://texttospeech.googleapis.com/v1/text:synthesize';
        const response = await client.request({
            url: url,
            method: 'POST',
            data: {
                input: { ssml: `<speak>${text}</speak>` },
                voice: {
                    languageCode: languageCode,
                    // name: 'en-US-Wavenet-D',
                    // ssmlGender: 'NEUTRAL'
                },
                audioConfig: {
                    audioEncoding: 'MP3'
                }
            }
        });

        const data = response.data;
        return data.audioContent;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

module.exports = {
    submitData,
    getAudio,
    getGoogleCloudAudio
};