import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import ApolloProviderWrapper from "@/components/ui/ApolloProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ConverseGenie",
  description: "An AI assistant Saas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProviderWrapper>
      <ClerkProvider>
        <html lang="en">
          <body className="min-h-screen flex">
            {children}
            <Toaster position="bottom-center" />
          </body>
        </html>
      </ClerkProvider>
    </ApolloProviderWrapper>
  );
}
