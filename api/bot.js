export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Сервер работает");
  }

  const update = req.body;
  const chatId = update.message?.chat?.id;
  const userText = update.message?.text;

  if (chatId && userText) {
    const tgUrl = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;
    await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Бот получил сообщение: ${userText}`
      })
    });
  }

  return res.status(200).send("OK");
}
