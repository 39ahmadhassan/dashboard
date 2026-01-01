"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

interface CreateUserProfileParams {
  uid: string;
  name: string;
  email: string;
}

export async function createUserProfile({
  uid,
  name,
  email,
}: CreateUserProfileParams) {
  try {
    await adminDb.collection("users").doc(uid).set({
      uid,
      name,
      email,
      role: "user",
      bio: "",
      avatarUrl: "",
      preferences: { theme: "light" },
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Server Action Error:", error);
    return {
      success: false,
      message: "Failed to create user profile",
    };
  }
}
