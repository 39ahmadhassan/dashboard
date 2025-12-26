"use client";

import { auth } from "@/lib/firebase";
import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    console.log("Auth object:", auth);
  }, []);

  return <div className="p-4">Check console for Firebase auth object</div>;
}
