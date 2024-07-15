import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_KEY}`);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are a helpful AI Chatbot assistant talking to a user. Use Emoji's where possible.`,
});

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
    const previousMessages = messagesData?.chat_sessions?.messages;

    const formattedPreviousMessages = previousMessages
      .map((message: { sender: string; content: any }) => message.content)
      .join(" + ");

    // Combine the characteristic into system prompt

    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    const messages = `This is user's message - ${content} and your reponse will only be related to this. Here is some key information that you need to be aware of: these are the characteristics that you may be asked about: ${systemPrompt}
                    I will give you three steps that you have to follow - 
                    Step 1: The latest message that user sent is “${content}”. So please check if it is related to any of these characteristics separated by "+" - ${systemPrompt} and give reponse accordingly and your reponse will only be 
                    related to this ${content} and do not check next steps. If not follow Step 2. 
                    Step 2: If user message that is ${content} is "no thanks," "not interested," or "maybe later," or "no" then give this reply "Okay, thanks! You can come back later if you need anything." or something similar like this. 
                    If ${content} is "hi" or "hello" or “hey” or any other greeting then give this reply “Hello! How can I assist you today?“ or something similar like this. If ${content} is “thanks" or "thank you" then give this reply 
                    “You're welcome! If you have any other questions, feel free to ask.“ or something similar like this. If ${content} is "bye" or "goodbye" then give this reply “Goodbye! Have a great day!“ or something similar like this. 
                    If ${content} is "help" or "support" then give this reply “Sure, I'd be happy to help. What do you need assistance with?“ or something similar like this. If ${content} is "ok" then give this reply “Is there anything else 
                    that I can help you with??“ or something similar like this. Now if ${content} is not any of these then follow Step 3.
                    Step 3: If user message(${content}) is any gibberish or not at all relevant to the specified content that is ${systemPrompt} just say "I'm sorry, I didn't understand that. Could you please rephrase your question?"`;

    // Send this message to api and take response

    const result = await model.generateContent(messages);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    // Save the User's message in the database
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content,
        sender: "user",
      },
    });

    // Save the AI's response in the database
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content: text,
        sender: "ai",
      },
    });

    // Return the AI's response to the client
    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: text,
    });
  } catch (error) {
    console.log("Error sending message :", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
