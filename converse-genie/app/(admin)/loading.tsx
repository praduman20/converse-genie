"use client";

import Image from "next/image";
import { createAvatar } from "@dicebear/core";
import { rings } from "@dicebear/collection";
import { usePathname } from "next/navigation";

function Loading() {
  const path = usePathname();
  const isLoadingNeeded =
    path.includes("review-sessions") || path.includes("view-chatbots");

  const seed = "PAPAFAM Support Agent";
  const avatar = createAvatar(rings, {
    seed,
  });

  const svg = avatar.toString();

  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;

  if (!isLoadingNeeded) return null;

  return (
    <div className="h-full w-full animate-pulse flex justify-center items-center">
      <Image src={dataUrl} alt="User Avatar" width={250} height={200} />
    </div>
  );
}

export default Loading;
