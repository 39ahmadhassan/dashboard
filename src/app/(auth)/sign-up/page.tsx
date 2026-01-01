"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { createUserProfile } from "@/actions/createUserProfile";

// ShadCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<SignUpFormData>({
      resolver: zodResolver(signUpSchema),
    });

  const onSubmit = async (data: SignUpFormData) => {
    if (loading) return;
    setLoading(true);
    setEmailExists(false);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const result = await createUserProfile({
        uid: res.user.uid,
        name: data.name,
        email: data.email,
      });

      if (!result.success) throw new Error(result.message);

      await signOut(auth);

      setSuccess(true);
      setTimeout(() => router.replace("/sign-in"), 1500);

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") setEmailExists(true);
      else alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Sign-Up
  const handleGoogleSignUp = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      // Create user profile in Firestore if new user
      const result = await createUserProfile({
        uid: res.user.uid,
        name: res.user.displayName || "Google User",
        email: res.user.email || "",
      });

      if (!result.success) throw new Error(result.message);

      setSuccess(true);
      setTimeout(() => router.replace("/sign-in"), 1500);

    } catch (err: any) {
      alert(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {success && (
            <Alert className="border-green-500 text-green-700">
              <AlertDescription>
                Account created successfully! Redirecting…
              </AlertDescription>
            </Alert>
          )}

          {emailExists && (
            <Alert variant="destructive">
              <AlertDescription>Email already exists.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" {...register("password")} />
              {errors.password && <p className="text-destructive">{errors.password.message}</p>}
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center mt-2">or</div>

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign up with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}






























// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// import { createUserProfile } from "@/actions/createUserProfile";

// // ShadCN UI
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// const signUpSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// type SignUpFormData = z.infer<typeof signUpSchema>;

// export default function SignUpPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [emailExists, setEmailExists] = useState(false);

//   const { register, handleSubmit, formState: { errors } } =
//     useForm<SignUpFormData>({
//       resolver: zodResolver(signUpSchema),
//     });

//   const onSubmit = async (data: SignUpFormData) => {
//     if (loading) return;
//     setLoading(true);
//     setEmailExists(false);

//     try {
//       // 1️⃣ Firebase Auth (Client-side - correct)
//       const res = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       // 2️⃣ Firestore via Server Action (BEST PRACTICE)
//       const result = await createUserProfile({
//         uid: res.user.uid,
//         name: data.name,
//         email: data.email,
//       });

//       if (!result.success) {
//         throw new Error(result.message);
//       }

//       // 3️⃣ Optional sign out
//       await signOut(auth);

//       setSuccess(true);

//       setTimeout(() => {
//         router.replace("/sign-in");
//       }, 1500);

//     } catch (err: any) {
//       if (err.code === "auth/email-already-in-use") {
//         setEmailExists(true);
//       } else {
//         alert(err.message || "Something went wrong");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted px-4">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle className="text-center text-xl">
//             Create Account
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {success && (
//             <Alert className="border-green-500 text-green-700">
//               <AlertDescription>
//                 Account created successfully! Redirecting…
//               </AlertDescription>
//             </Alert>
//           )}

//           {emailExists && (
//             <Alert variant="destructive">
//               <AlertDescription>
//                 Email already exists.
//               </AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <Label>Name</Label>
//               <Input {...register("name")} />
//               {errors.name && <p className="text-destructive">{errors.name.message}</p>}
//             </div>

//             <div>
//               <Label>Email</Label>
//               <Input type="email" {...register("email")} />
//               {errors.email && <p className="text-destructive">{errors.email.message}</p>}
//             </div>

//             <div>
//               <Label>Password</Label>
//               <Input type="password" {...register("password")} />
//               {errors.password && <p className="text-destructive">{errors.password.message}</p>}
//             </div>

//             <Button className="w-full" disabled={loading}>
//               {loading ? "Creating..." : "Sign Up"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }