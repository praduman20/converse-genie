"use client";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATE_CHATBOT } from "@/graphql/mutations/mutations";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

function CreateChatbot() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  const [createChatbot, { data, loading, error }] = useMutation(
    CREATE_CHATBOT,
    {
      variables: {
        clerk_user_id: user?.id,
        name,
        date,
      },
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const date = new Date();
    setDate(date);
    try {
      const data = await createChatbot();
      setName("");
      setDate(new Date());

      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 m-10 rounded-md">
      <Avatar seed="PAPAFAM Support Agent" className="opacity-50" />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your conversations with your
          customers.
        </h2>
        <form
          className="flex flex-col md:flex-row gap-2 mt-5"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chatbot Name..."
            className="max-w-lg"
            required
          />
          <Button type="submit" disabled={loading || !name}>
            {loading ? "Creating Chatbot..." : "Create Chatbot"}
          </Button>
        </form>

        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}

export default CreateChatbot;
