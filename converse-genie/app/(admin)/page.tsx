"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Animation from "@/public/images/animate.json";
import Lottie from "lottie-react";

export default function Home() {
  return (
    <main className="p-10 bg-white m-10 rounded-md w-full">
      <h1 className="text-4xl font-light">
        Welcome to{" "}
        <span className="text-[#64B5F5] font-semibold">ConverseGenie</span>
      </h1>

      <h2 className="mt-2 mb-8">
        Your customisable AI chat agent that helps you manage your customer
        conversations.
      </h2>

      <Link href="/create-chatbot">
        <Button className="bg-[#64B5F5]">
          Let's get started by creating your first chatbot
        </Button>
      </Link>

      <Lottie animationData={Animation} className="h-80" />
    </main>
  );
}
