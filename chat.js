export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { messages, system } = req.body;

    // Construire les messages pour OpenAI
    // OpenAI utilise un message "system" en premier dans le tableau
    const openaiMessages = [
      { role: "system", content: system },
      ...messages
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 4000,
        messages: openaiMessages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ text: "Erreur OpenAI : " + data.error.message });
    }

    const text = data.choices?.[0]?.message?.content || "Aucune réponse.";
    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ text: "Erreur serveur : " + err.message });
  }
}
