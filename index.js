require("dotenv").config();
const express = require("express");
const axios = require('axios');


const app = express();
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;


const port = process.env.PORT || 5000;
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;
  // const prompt = 'Hi';
  const messages = [
    {"role": "system", "content": "You are a professional mental health therapist, answer as professional as possible."},
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello, Welcome to this therapy session. How may i help you today?"},
    {"role": "user", "content": prompt}
  ];
  let data = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: messages
  });
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    data: data
};
  try {
    // console.log(prompt)
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    const response = await axios(config)
    .then((response) => {
      messages.push(response.data.choices[0].message);
      // console.log(messages);
      const completion = response.data.choices[0].message.content;
      return res.status(200).json({
        success: true,
        message: completion,
      });

    })
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));