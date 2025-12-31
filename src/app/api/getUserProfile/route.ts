import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin"; // Make sure admin SDK is initialized

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) return NextResponse.json({ user: null }, { status: 400 });

    const docSnap = await adminDb.collection("users").doc(uid).get();
    if (!docSnap.exists) return NextResponse.json({ user: null }, { status: 404 });

    const userData = docSnap.data();

    // Include UID in the returned object
    return NextResponse.json({ user: { uid, ...userData } }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
