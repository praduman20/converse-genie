import { ApolloClient } from "@apollo/client";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { gql } from "@apollo/client";
import client from "@/graphql/apolloClient";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    // Create guest Entry
    const guestResult = await client.mutate({
      mutation: gql`
        mutation insertGuest($name: String!, $email: String!) {
          insertGuests(name: $name, email: $email) {
            id
          }
        }
      `,
      variables: { name: guestName, emmai: guestEmail },
    });
    const guestId = guestResult.data.insertGuests.id;

    //
  } catch (error) {
    console.log("Error starting a new chat session:", error);
  }
}
