/**
 * Groq Client — wrapper around the OpenAI-compatible Groq API
 * for generating persona-based scambaiting replies.
 *
 * Migrated from @google/generative-ai to openai (Groq-compatible).
 */

const OpenAI = require("openai");

let groqClient = null;

/**
 * Initialize the Groq client (call once at startup).
 */
function initGroq() {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    console.warn("⚠️  GROK_API_KEY not set. AI replies will use fallback responses.");
    return;
  }
  groqClient = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
  console.log("✅ Groq client initialized.");
}

/**
 * Generate a scambaiting reply using Groq.
 *
 * @param {string} systemPrompt - The persona system instruction
 * @param {Array} conversationHistory - Array of { sender, text } objects
 * @param {string} newMessage - The latest scammer message
 * @returns {Promise<string>} The AI-generated reply
 */
async function generateReply(systemPrompt, conversationHistory, newMessage) {
  // Fallback if Groq is not configured
  if (!groqClient) {
    return getFallbackReply();
  }

  try {
    // Build messages in OpenAI chat format
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Append conversation history
    for (const msg of conversationHistory || []) {
      messages.push({
        role: msg.sender === "scammer" ? "user" : "assistant",
        content: msg.text,
      });
    }

    // Append the new scammer message
    messages.push({ role: "user", content: newMessage });

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.8,
      max_tokens: 256,
    });

    const text = completion.choices?.[0]?.message?.content;
    return text || getFallbackReply();
  } catch (error) {
    console.error("❌ Groq API error:", error.message);
    return getFallbackReply();
  }
}

/**
 * Classify whether the conversation indicates a scam.
 * Uses Groq with a short classification prompt.
 *
 * @param {Array} conversationHistory - Array of { sender, text } objects
 * @param {string} latestMessage - The latest scammer message
 * @returns {Promise<boolean>} true if scam confirmed
 */
async function classifyScamIntent(conversationHistory, latestMessage) {
  if (!groqClient) {
    return false; // Can't classify without AI
  }

  try {
    const transcript = (conversationHistory || [])
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n");

    const prompt = transcript
      ? `${transcript}\nscammer: ${latestMessage}\n\nIs this a scam? (YES/NO)`
      : `scammer: ${latestMessage}\n\nIs this a scam? (YES/NO)`;

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a scam detection classifier. Analyze the conversation below and determine if the sender is attempting a scam (phishing, fraud, social engineering, fake offers, etc.). Respond with ONLY the word YES or NO.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      max_tokens: 8,
    });

    const answer = (completion.choices?.[0]?.message?.content || "")
      .trim()
      .toUpperCase();

    console.log(`🔍 Scam classification result: ${answer}`);
    return answer.startsWith("YES");
  } catch (error) {
    console.error("❌ Scam classification error:", error.message);
    return false;
  }
}

/**
 * Fallback replies when Groq is unavailable.
 */
function getFallbackReply() {
  const fallbacks = [
    "sir please wait... my phone is hanging...",
    "bro hold on... network issue...",
    "one minute sir... i am trying...",
    "sir link is not opening... showing error...",
    "bhai wait... otp not coming...",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

module.exports = { initGroq, generateReply, classifyScamIntent };
