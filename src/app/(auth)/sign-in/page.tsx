"use client"; // Important for client-side components (forms, auth, hooks)

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {  // ✅ Must be default exported React component
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: data.name,
        bio: "",
        avatarUrl: "",
        role: "user",
        preferences: { theme: "light" },
        createdAt: new Date(),
      });
      alert("Sign-Up Successful");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 p-4">
      <input {...register("name")} placeholder="Name" className="border p-2 rounded" />
      <input {...register("email")} placeholder="Email" className="border p-2 rounded" />
      <input {...register("password")} type="password" placeholder="Password" className="border p-2 rounded" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
    </form>
  );
}
