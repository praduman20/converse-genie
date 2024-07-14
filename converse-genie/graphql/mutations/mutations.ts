import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot(
    $clerk_user_id: String!
    $name: String!
    $date: DateTime!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      name: $name
      created_at: $date
    ) {
      id
      name
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($characteristicId: Int!) {
    deleteChatbot_characteristics(id: $characteristicId) {
      id
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatboy($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic(
    $chatbotId: Int!
    $content: String!
    $date: DateTime!
  ) {
    insertChatbot_characteristics(
      chatbot_id: $chatbotId
      content: $content
      created_at: $date
    ) {
      id
      content
      created_at
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbot($id: Int!, $name: String!) {
    updateChatbots(id: $id, name: $name) {
      id
      name
      created_at
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage(
    $chat_session_id: Int!
    $content: String!
    $sender: String!
  ) {
    insertMessages(
      chat_session_id: $chat_session_id
      content: $content
      sender: $sender
    ) {
      id
    }
  }
`;

export const INSERT_GUEST = gql`
  mutation insertGuest($name: String!, $email: String!, $date: DateTime!) {
    insertGuests(name: $name, email: $email, created_at: $date) {
      id
    }
  }
`;

export const INSERT_CHAT_SESSION = gql`
  mutation insertChatSession(
    $chatbot_id: Int!
    $guest_id: Int!
    $date: DateTime!
  ) {
    insertChat_sessions(
      chatbot_id: $chatbot_id
      guest_id: $guest_id
      created_at: $date
    ) {
      id
      guest_id
      created_at
      chatbot_id
    }
  }
`;
