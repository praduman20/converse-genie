import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

// remove
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  try {
    // Fetch chatbot characteristics
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: {
        id: chatbot_id,
      },
    });

    const chatbot = data.chatbots;

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // Fetch previos messages
    const { data: messagesData } = await serverClient.query({
      query: GET_MESSAGES_BY_CHAT_SESSION_ID,
      variables: { chat_session_id: chat_session_id },
      fetchPolicy: "no-cache",
    });
    const previousMessages = messagesData.chat_sessions.messages;

    const formattedPreviousMessages = previousMessages.map(
      (message: { sender: string; content: any }) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      })
    );

    // Combine the characteristic into system prompt

    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    console.log(systemPrompt);

    const messages = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same 
        scope or domain as the points in mentioned in the key information section, kindly inform the user theyre only allowed to search
        for the specified content. Use Emoji's where possible. Here is some key information that you need to be aware of, these are 
        elements you may be asked about: ${systemPrompt}`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];

    // send this message to api and take response

    const result = await model.generateContent(messages);
    const response = await result.response;

    console.log(response);
  } catch (error) {
    console.log("Error sending message :", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
