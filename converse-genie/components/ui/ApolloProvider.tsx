"use client";

import client from "@/graphql/apolloClient";
import { ApolloProvider } from "@apollo/client";

export default function ApolloProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
