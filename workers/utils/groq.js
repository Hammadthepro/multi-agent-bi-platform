export async function callGroq(prompt, systemPrompt, env) {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    // Rate limit hit — wait and retry
    if (response.status === 429) {
      const waitMs = attempt * 5000; // 5s, 10s, 15s
      console.log(`Rate limit hit, waiting ${waitMs}ms before retry ${attempt}/${maxRetries}`);
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }

    // Safety check
    if (!data.choices || data.choices.length === 0) {
      console.error("Groq error:", JSON.stringify(data));
      throw new Error(`Groq API error: ${JSON.stringify(data)}`);
    }

    return data.choices[0].message.content;
  }

  throw new Error("Groq rate limit exceeded after retries. Please wait a minute and try again.");
}