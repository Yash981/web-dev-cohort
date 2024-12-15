import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateEmbedding = async (text: string) => {
  try {
    //@ts-ignore
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text }],
          },
        }),
      }
    );
    if (!response.ok) {
      console.log("Error", response.status);
    }
    const res = await response.json();
    console.log(res.embedding.values);
    //@ts-ignore
    return res.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error.message);
    throw error;
  }
};

export const summarizeSearchResults = async (
  searchResults: any,
  userQuery: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const formattedResults = searchResults
      .map(
        ({ content, score }) =>
          `Title: ${content.title}, Link: ${content.link}, Type: ${content.type}, Relevance Score: ${score}`
      )
      .join("\n");

    const prompt = `
User Query: "${userQuery}"

Search Results:
${formattedResults}

Instructions:
1. Analyze the search results to determine if there is information that directly answers the user's query.
2. If the search results contain relevant details, construct a response that directly answers the query using only those details. Keep the response concise and strictly relevant to the query.
3. If the search results contain a relevant link, include it at the end of the response in the format: "For more details, refer to the link: [Title](Link)."
4. If the search results do not contain relevant information, respond with: "No results found for your query."
5. If the results provide very limited information, return a short, accurate response and mention that the information is limited.

Response:
Based on the query and the search results, provide a response as instructed above.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Paragraph generation error:", error);
    throw error;
  }
};
