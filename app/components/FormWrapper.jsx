"use client";

import dynamic from "next/dynamic";


const AddSSDetails = dynamic(
  () => import("./SanghaForm"),
  { ssr: false }
);

export default function FormWrapper() {
  return <AddSSDetails />;
}