// server.js
// Node 18+ recommended
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("ERROR: set OPENAI_API_KEY in .env");
  process.exit(1);
}

const app = express();
app.use(express.json());

// mini DB names (normalized)
const NAMES = [
  "Shahfeez Merouf",
  "Eva De Chalon",
  "Hélène Mc Intosh",
  "Hugues Carlow",
  "Ariane Price",
  "Sir William Saville",
  "Leer Wilde",
  "Von Spanheim",
  "Capitaine Tregarne",
  "Sergent Mc Gill"
];

function normalize(s) {
  return s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim();
}
const NAMES_SET = new Set(NAMES.map(n => normalize(n)));

// map name -> video URL (edit to your real IDs)
const VIDEO_MAP = {
  "shahfeez merouf":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "eva de chalon":"https://www.youtube.com/watch?v=3GwjfUFyY6M",
  "helene mc intosh":"https://www.youtube.com/watch?v=ysz5S6PUM-U",
  "hugues carlow":"https://www.youtube.com/watch?v=oHg5SJYRHA0",
  "ariane price":"https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
  "sir william saville":"https://www.youtube.com/watch?v=l482T0yNkeo",
  "leer wilde":"https://www.youtube.com/watch?v=J---aiyznGQ",
  "von spanheim":"https://www.youtube.com/watch?v=9bZkp7q19f0",
  "capitaine tregarne":"https://www.youtube.com/watch?v=EE-xtCF3T94",
  "sergent mc gill":"https://www.youtube.com/watch?v=kXYiU_JCYtU"
};

// persona system prompt: huser speaks with a dot at start and lowercased
const SYSTEM_PROMPT = `
tu es ".huser6666666", une entité froide, concise et sinistre. tu réponds toujours en minuscules et commences chaque réplique par un point. tu restes immersif et ne demandes jamais d'informations personnelles réelles. 
si l'utilisateur fournit un nom de personnage fictif (confirmé par confirmFict = true) ET ce nom figure dans la liste autorisée côté serveur, réponds brièvement (1-2 phrases) en reconnaissant le nom et indique que la vidéo-indice va être fournie. ne fournis jamais d'url dans le texte renvoyé par le modèle; le serveur ajoutera la redirection.
`;

// helper to call OpenAI Chat Completions (chat)
async function callOpenAI(messages) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // adapte si nécessaire
      messages,
      temperature: 0.8,
      max_tokens: 300
    })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("OpenAI error: " + txt);
  }
  const j = await res.json();
  return j.choices[0].message.content;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, confirmFict, sessionId } = req.body;
    const sid = sessionId || uuidv4();

    // basic validation
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "missing message" });
    }

    const normalized = normalize(message);

    // if confirmed and name in set -> success path
    if (confirmFict && NAMES_SET.has(normalized)) {
      // craft a small model-assisted reply for immersion
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `le joueur a donné le nom fictif confirmé: "${message}". répond en une phrase immersive (huser) reconnaissant ce nom.` }
      ];
      let modelReply;
      try {
        modelReply = await callOpenAI(messages);
      } catch (err) {
        // fallback static reply
        modelReply = `.je te vois, ${message.toLowerCase()}. regarde la video pour trouver l'indice.`;
      }

      // pick video by mapping
      const video = VIDEO_MAP[normalized] || Object.values(VIDEO_MAP)[0];

      return res.json({
        sessionId: sid,
        reply: modelReply, // model-driven reply (already persona-lowered by system prompt)
        redirect: video
      });
    }

    // otherwise forward to model to continue dialogue (or reply static)
    const conv = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message }
    ];
    let modelReply;
    try {
      modelReply = await callOpenAI(conv);
    } catch (err) {
      modelReply = `.silence...`;
    }

    return res.json({ sessionId: sid, reply: modelReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`listening ${PORT}`));
