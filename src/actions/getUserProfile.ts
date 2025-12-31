"use server";

import { adminDb } from "@/lib/firebase-admin";

export async function getUserProfile(uid: string) {
  if (!uid) return null;

  try {
    const docRef = adminDb.collection("users").doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    return docSnap.data();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
