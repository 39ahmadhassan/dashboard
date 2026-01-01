"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function onUserSignIn(uid: string) {
  try {
    const userRef = adminDb.collection("users").doc(uid);
    const snap = await userRef.get();

    // 🚫 Profile not found (very important)
    if (!snap.exists) {
      return {
        success: false,
        message: "User profile not found",
      };
    }

    // ✅ Update last login timestamp
    await userRef.update({
      lastLoginAt: FieldValue.serverTimestamp(),
    });

    // ✅ Return useful server-side data
    const userData = snap.data();

    return {
      success: true,
      role: userData?.role || "user",
    };
  } catch (error) {
    console.error("❌ Sign-in Server Action Error:", error);
    return {
      success: false,
      message: "Server validation failed",
    };
  }
}
