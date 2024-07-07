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
