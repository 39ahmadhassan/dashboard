import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// ✅ Allowed roles (must match dropdown)
const ALLOWED_ROLES = [
  "admin",
  "user",
  "editor",
  "manager",
  "viewer",
];

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request body
    const body = await req.json();
    const { uid, name, role } = body;

    // 2️⃣ Basic validation
    if (!uid || !name) {
      return NextResponse.json(
        { error: "UID and name are required" },
        { status: 400 }
      );
    }

    // 3️⃣ Validate role (SECURITY)
    if (role && !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role value" },
        { status: 400 }
      );
    }

    // 4️⃣ Update Firestore using Admin SDK
    await adminDb.collection("users").doc(uid).update({
      name,
      role: role ?? "user",
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 5️⃣ Success response
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("❌ Update profile error:", error);

    // 6️⃣ Error response
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
