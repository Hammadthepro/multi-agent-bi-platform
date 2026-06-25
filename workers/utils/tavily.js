export async function searchWeb(query, env) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.TAVILY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query,
      max_results: 5,
      search_depth: "basic"
    })
  });

  const data = await response.json();
  return data.results.map(r => ({
    title: r.title,
    url: r.url,
    content: r.content
  }));
}