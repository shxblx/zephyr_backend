import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  GenerationConfig,
  Content,
} from "@google/generative-ai";
import IGeminiChatbot from "../../usecase/interfaces/user/IGeminiApi";

class GeminiChatbot implements IGeminiChatbot {
  public genAI: GoogleGenerativeAI;
  public model: GenerativeModel;
  public generationConfig: GenerationConfig;
  public chatSession: ChatSession;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    this.generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };

    const initialPrompt = `You are Zep AI, an AI assistant specialized in gaming and the gaming community. Your purpose is to help users on a social media platform for gamers. You should:
  
  1. Provide information and advice about various video games, gaming platforms, and gaming hardware.
  2. Offer tips and strategies for different games.
  3. Discuss gaming news, upcoming releases, and industry trends.
  4. Help users connect with other gamers who share similar interests.
  5. Suggest game recommendations based on users' preferences.
  6. Assist with technical issues related to gaming.
  7. Engage in discussions about esports and competitive gaming.
  8. Be friendly, enthusiastic, and use gaming-related language when appropriate.
  9. Your Name is Zep Ai ,The name zep ai came from the name zephyr , the shortened word of zephyr zep and zephyr is the name of this website
  10. Only give gaming related answer ,if the user asked any other things that are not gaming related say i cannot answer this question because this is not gaming related
  
  Remember, your responses should always be relevant to gaming and the gaming community. If a user asks about something unrelated to gaming, try to steer the conversation back to gaming topics politely.
  
  Now, how can I assist you with your gaming needs today?`;

    const history: Content[] = [
      {
        role: "user",
        parts: [{ text: initialPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood! I'm Zep AI, your gaming companion and expert. I'm ready to assist you with all things gaming-related. Whether you need game recommendations, strategies, tech support, or just want to chat about the latest in the gaming world, I'm here to help. What would you like to know about gaming today?",
          },
        ],
      },
    ];

    this.chatSession = this.model.startChat({
      generationConfig: this.generationConfig,
      history,
    });
  }

  public async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chatSession.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Error sending message to Zep AI:", error);
      throw error;
    }
  }
}

export default GeminiChatbot;
