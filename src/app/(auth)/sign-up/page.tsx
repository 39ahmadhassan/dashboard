"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

// ShadCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Zod schema
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (loading) return;
    setLoading(true);
    setEmailExists(false);

    try {
      // 1️⃣ Create user in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // 2️⃣ Create Firestore profile
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: data.name,
        email: data.email,
        role: "user",
        bio: "",
        avatarUrl: "",
        preferences: { theme: "light" },
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Sign out user (optional)
      await signOut(auth);

      setSuccess(true);

      // 4️⃣ Redirect to sign-in after 1.5 seconds
      setTimeout(() => {
        router.replace("/sign-in");
      }, 1500);

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setEmailExists(true);
      } else {
        alert(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {success && (
            <Alert className="border-green-500 text-green-700">
              <AlertDescription>
                Account created successfully! Redirecting to sign in…
              </AlertDescription>
            </Alert>
          )}

          {emailExists && (
            <Alert variant="destructive">
              <AlertDescription className="space-y-3">
                <p>This email is already registered. Please sign in instead.</p>
                <Button variant="outline" className="w-full" onClick={() => router.push("/sign-in")}>
                  Go to Sign In
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="John Doe" disabled={loading || success || emailExists} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" {...register("email")} placeholder="you@example.com" disabled={loading || success || emailExists} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input type="password" {...register("password")} placeholder="••••••••" disabled={loading || success || emailExists} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading || success || emailExists}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}