const submitData = async (from, to, userInput) => {
  try {
    const response = await fetch(process.env.OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `you are an ${from} dictionary, when I input an ${from} word or expression, you tell me the pronunciation, a short ${to} translation, and meaning and sample sentences of this word in ${from}. If this word has multiple forms, such as noun, verb, adjective, etc., you should tell me all the forms. If this word has multiple meanings, you should tell me all the meanings in ${from}. If this word has multiple pronunciations, you should tell me all the pronunciations. For different meanings or forms, you should use an additional empty line to separate them.`,
          },
          { role: "user", content: userInput },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const submitDataGroq = async (from, to, userInput) => {
  try {
    const response = await fetch(process.env.GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_TOKEN}`,
      },
      body: JSON.stringify({
        model: "qwen-2.5-32b",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
        messages: [
          {
            role: "system",
            content: `you are an ${from} dictionary, when I input an ${from} word or expression, you tell me the pronunciation, a short ${to} translation, and meaning and sample sentences of this word in ${from}. 
            If this word has multiple forms, such as noun, verb, adjective, etc., you should tell me all the forms. If this word has multiple meanings, you should tell me all the meanings in ${from}. 
            If this word has multiple pronunciations, you should tell me all the pronunciations. For different meanings or forms, you should use an additional empty line to separate them. 
            For each section title, you should wrap it with two stars, like **Pronunciation**.`,
          },
          { role: "user", content: userInput },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const submitDataGemini = async (from, to, userInput) => {
  try {
    const response = await fetch(process.env.GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.GEMINI_API_TOKEN}`,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: {
            text: `you are an ${from} dictionary, when I input an ${from} word or expression, you tell me the pronunciation, a short ${to} translation, and meaning and sample sentences of this word in ${from}. 
            If this word has multiple forms, such as noun, verb, adjective, etc., you should tell me all the forms. If this word has multiple meanings, you should tell me all the meanings in ${from}. 
            If this word has multiple pronunciations, you should tell me all the pronunciations. For different meanings or forms, you should use an additional empty line to separate them. 
            For each section title, you should wrap it with two stars, like **Pronunciation**.`,
          },
        },
        contents: {
          parts: {
            text: userInput,
          },
        },
      }),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

module.exports = {
  submitData,
  submitDataGroq,
  submitDataGemini,
};
