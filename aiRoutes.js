import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/ai/message-suggestions", async (req, res) => {
  try {
    const { objective } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a marketing assistant." },
        { role: "user", content: `Suggest 3 short campaign messages for: ${objective}` }
      ],
      max_tokens: 150,
    });
    const suggestions = response.choices[0].message.content
      .split("\n")
      .filter(Boolean);
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
