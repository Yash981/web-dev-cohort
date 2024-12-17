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
  } catch (error:any) {
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
        ({ content, score }:{content:any,score:string}) =>
          `Title: ${content.title}, Link: ${content.link}, Type: ${content.type}, Relevance Score: ${score}`
      )
      .join("\n");

//     const prompt = `
// User Query: "${userQuery}"

// Search Results:
// ${formattedResults}

// Instructions:
// 1. Analyze the search results to determine if there is information that directly answers the user's query.
// 2. If the search results contain relevant details, construct a response that directly answers the query using only those details. Keep the response concise and strictly relevant to the query.
// 3. If the search results contain a relevant link, include it at the end of the response in the format: "For more details, refer to the link: [Title](Link)."
// 4. If the search results do not contain relevant information, respond with: "No results found for your query."
// 5. If the results provide very limited information, return a short, accurate response and mention that the information is limited.

// Response:
// Based on the query and the search results, provide a response as instructed above.`;
      const prompt = `CONTEXT:
- You are an intelligent semantic search assistant for a knowledge management system
- Your goal is to provide precise, contextual responses based on embedded content

INPUT FORMAT:
[userQuery]: ${userQuery}
[formulatedResults]: ${formattedResults}

CORE RESPONSE GUIDELINES:

1. DIRECT ANSWER PRIORITY
- Respond ONLY to the actual query
- Provide a clear, concise answer
- Use only the information from available results
- NO need to repeat the query
- NO need to include a relevance score in the response

2. RESPONSE FORMAT:
- Provide a straightforward answer
- If relevant, include brief context
- Append source link at the end (if available)

3. NO REDUNDANT ELEMENTS
- Remove:
  * Repeating user query
  * Unnecessary metadata
  * Self-referential explanations

EXAMPLE RESPONSES:

Query: "can you please code with antonio youtube link"
Response: 
Here's the YouTube link for Code with Antonio: https://youtu.be/gq2bbDmSokU?si=yfXryz_BunSgtqQy

Query: "who picks the wicket"
Response:
Based on the available information, it appears Siraj took a wicket in a match involving RCB (Royal Challengers Bangalore).
Source: https://x.com/sagarcasm/status/1865313283311370360

KEY PRINCIPLES:
- Answer first
- Context second
- Source last
- No unnecessary repetition

TWEET INFORMATION EXTRACTION GUIDELINES:

CORE OBJECTIVES:
- Extract key details from tweet links
- Present information in a clear, structured format
- Simulate a tweet-card like display of information

EXTRACTION PARAMETERS:
1. User Information
- Username
- Profile handle
- Verified status
- Profile image (if possible)

2. Tweet Content
- Full text of the tweet
- Timestamp
- Engagement metrics (likes, retweets)
- Media attachments (if present)

3. Context Extraction
- Key topics
- Sentiment analysis
- Relevant hashtags

RESPONSE FORMAT:

[🐦 Tweet Card]
-------------------------
👤 Username: [Full Name]
@handle | ✅ Verified

Tweet Content:
"[Exact tweet text]"

📊 Engagement:
- Likes: X
- Retweets: Y
- Date: [Timestamp]

🏷️ Topics/Hashtags:
- [Relevant Tags]

-------------------------
Source: [Original Tweet Link]

`
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error:any) {
    console.error("Paragraph generation error:", error);
    throw error;
  }
};
