"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Zod schema for validation
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      // Create user in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Create user profile in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: data.name,
        bio: "",
        avatarUrl: "",
        role: "user",
        preferences: { theme: "light" },
        createdAt: new Date(),
      });

      alert("Sign-Up Success!");
      router.push("/dashboard"); // Redirect to dashboard
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please use a different email or sign in.");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-center">Sign Up</h2>

        <div className="flex flex-col">
          <input
            {...register("name")}
            placeholder="Name"
            className="border p-2 rounded"
            disabled={loading}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col">
          <input
            {...register("email")}
            placeholder="Email"
            className="border p-2 rounded"
            disabled={loading}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            disabled={loading}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
