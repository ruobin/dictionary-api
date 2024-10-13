

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
        throw error;
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
        throw error;
    }
};

module.exports = {
    submitData,
    getAudio
};