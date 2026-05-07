export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const update = req.body;
  if (!update.message || !update.message.text) {
    return res.status(200).send("OK");
  }

  const chatId = update.message.chat.id;
  const userText = update.message.text;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const geminiResponse = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userText }] }],
      tools: [{ googleSearch: {} }]
    })
  });

  const geminiData = await geminiResponse.json();
  let replyText = "Ошибка генерации. Ответ API: " + JSON.stringify(geminiData);
  
  if (geminiData.candidates && geminiData.candidates[0].content) {
    replyText = geminiData.candidates[0].content.parts[0].text;
  }

  const tgUrl = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;
  await fetch(tgUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: replyText
    })
  });

  return res.status(200).send("OK");
}
