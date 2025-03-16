import { GoogleGenerativeAI } from "@google/generative-ai";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(req) {
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);
  
    // Accessing the API key from environment variables (server-side)
    const apiKey = process.env.GOOGLE_API_KEY;
  
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is missing' }), { status: 400 });
    }
  
    try {
      // Initialize the GoogleGenerativeAI client with your API key
      const genAI = new GoogleGenerativeAI(apiKey);
  
      // Get the Generative Model
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
      // Define the prompt
      const prompt = params.get('prompt');
      console.log(prompt)
  
      // Call the model to generate a response based on the prompt
      const response = await model.generateContent(prompt);
  
      // Return the response in JSON format
      return new Response(JSON.stringify(response.response.text()), { status: 200 });
    } catch (error) {
      console.error('Error interacting with Google Generative AI API:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }
  