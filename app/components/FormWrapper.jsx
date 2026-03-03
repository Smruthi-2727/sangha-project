"use client";

import dynamic from "next/dynamic";

// Disable SSR here (allowed because this is client component)
const AddSSDetails = dynamic(
  () => import("./SanghaForm"),
  { ssr: false }
);

export default function FormWrapper() {
  return <AddSSDetails />;
}