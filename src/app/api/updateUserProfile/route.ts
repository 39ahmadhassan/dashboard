import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, ...data } = body;

    if (!uid) {
      return NextResponse.json({ error: "UID missing" }, { status: 400 });
    }

    await adminDb.collection("users").doc(uid).set(
      {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true } // 🔥 keeps old fields
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
