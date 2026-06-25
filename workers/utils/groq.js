export async function callGroq(prompt, systemPrompt, env) {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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
          max_tokens: 800
        })
      });

      // Rate limit — wait and retry
      if (response.status === 429) {
        const waitMs = attempt * 8000;
        console.log(`Rate limit hit, waiting ${waitMs}ms, attempt ${attempt}/${maxRetries}`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      const text = await response.text();

      // Empty response check
      if (!text || text.trim() === "") {
        console.log(`Empty response on attempt ${attempt}, retrying...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      const data = JSON.parse(text);

      if (!data.choices || data.choices.length === 0) {
        console.error("Groq error:", JSON.stringify(data));
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      const content = data.choices[0].message.content;

      if (!content || content.trim() === "") {
        console.log(`Empty content on attempt ${attempt}, retrying...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      return content;

    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  throw new Error("Groq failed after all retries. Please try again in a minute.");
}