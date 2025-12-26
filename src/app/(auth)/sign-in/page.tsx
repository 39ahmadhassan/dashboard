"use client"; // Required for client-side hooks and Firebase auth

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner"; // for toast notifications

// Zod schema for form validation
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer TypeScript type from schema
type FormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [loading, setLoading] = useState(false);

  // Regular Email/Password Sign-Up
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Save user profile to Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: data.name,
        bio: "",
        avatarUrl: "",
        role: "user",
        preferences: { theme: "light" },
        createdAt: new Date(),
      });

      toast.success("Sign-Up Successful! You can now sign in.");
      reset();
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up / Sign-In
  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if Firestore document exists, if not create
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, {
        uid: user.uid,
        name: user.displayName || "Google User",
        bio: "",
        avatarUrl: user.photoURL || "",
        role: "user",
        preferences: { theme: "light" },
        createdAt: new Date(),
      }, { merge: true }); // merge true = don’t overwrite if exists

      toast.success("Signed in with Google!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="border p-2 rounded w-full"
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="border p-2 rounded w-full"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full"
            disabled={loading}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center my-4">or</div>

      <button
        onClick={handleGoogleSignUp}
        className={`bg-red-500 text-white p-2 rounded w-full hover:bg-red-600 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Continue with Google"}
      </button>
    </div>
  );
}
