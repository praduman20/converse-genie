import { ApolloClient } from "@apollo/client";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "@/graphql/mutations/mutations";
import client from "@/graphql/apolloClient";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  const date = new Date();
  try {
    // Create guest Entry
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: { name: guestName, email: guestEmail, date: date },
    });
    const guestId = guestResult.data.insertGuests.id;

    // Initialize a new chat session

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: { chatbot_id: chatbotId, guest_id: guestId, date: date },
    });
    console.log(chatSessionResult.data);
    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    // Insert initial message
    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        content: `Welcome ${guestName}!\n How can I assist you today? 😃`,
        sender: "ai",
      },
    });

    return chatSessionId;
  } catch (error) {
    console.log("Error starting a new chat session:", error);
  }
}

export default startNewChat;
