"use server"

import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export async function signUpAction(email: string, password: string, name: string) {
  const res = await createUserWithEmailAndPassword(auth, email, password)

  await setDoc(doc(db, "users", res.user.uid), {
    uid: res.user.uid,
    name,
    bio: "",
    avatarUrl: "",
    role: "user",
    preferences: { theme: "light" },
    createdAt: new Date(),
  })
}

export async function signInAction(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}
