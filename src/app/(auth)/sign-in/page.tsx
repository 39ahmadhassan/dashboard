"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onUserSignIn } from "@/actions/onUserSignIn";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const [loading, setLoading] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: SignInFormData) => {
    if (loading) return;

    setLoading(true);
    setUserNotFound(false);
    setErrorMsg("");

    try {
      // 1️⃣ Firebase Auth (client-side)
      const res = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 2️⃣ Server Action (secure backend validation)
      const serverResult = await onUserSignIn(res.user.uid);

      if (!serverResult.success) {
        setUserNotFound(true);
        setErrorMsg(serverResult.message || "Profile not found");
        return;
      }

      // 3️⃣ Redirect
      router.push("/dashboard");

    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setUserNotFound(true);
        setErrorMsg("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setErrorMsg("Incorrect password.");
      } else {
        setErrorMsg("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Sign-In
  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      // Call server action to ensure profile exists / create if new
      const serverResult = await onUserSignIn(res.user.uid);

      if (!serverResult.success) {
        setErrorMsg(serverResult.message || "Failed to fetch profile.");
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");

    } catch (err: any) {
      setErrorMsg(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Sign In
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMsg && (
            <Alert variant="destructive">
              <AlertDescription className="space-y-3">
                <p>{errorMsg}</p>
                {userNotFound && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/sign-up")}
                  >
                    Create Account
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                {...register("password")}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-2">or</div>

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
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
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// import { onUserSignIn } from "@/actions/onUserSignIn";

// // shadcn ui
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// const signInSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// type SignInFormData = z.infer<typeof signInSchema>;

// export default function SignInPage() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignInFormData>({
//     resolver: zodResolver(signInSchema),
//   });

//   const [loading, setLoading] = useState(false);
//   const [userNotFound, setUserNotFound] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const onSubmit = async (data: SignInFormData) => {
//     if (loading) return;

//     setLoading(true);
//     setUserNotFound(false);
//     setErrorMsg("");

//     try {
//       // 1️⃣ Firebase Auth (client-side)
//       const res = await signInWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       // 2️⃣ Server Action (secure backend validation)
//       const serverResult = await onUserSignIn(res.user.uid);

//       if (!serverResult.success) {
//         setUserNotFound(true);
//         setErrorMsg(serverResult.message || "Profile not found");
//         return;
//       }

//       // 3️⃣ Redirect
//       router.push("/dashboard");

//     } catch (err: any) {
//       if (err.code === "auth/user-not-found") {
//         setUserNotFound(true);
//         setErrorMsg("No account found with this email.");
//       } else if (err.code === "auth/wrong-password") {
//         setErrorMsg("Incorrect password.");
//       } else {
//         setErrorMsg("Invalid email or password.");
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
//             Sign In
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {errorMsg && (
//             <Alert variant="destructive">
//               <AlertDescription className="space-y-3">
//                 <p>{errorMsg}</p>

//                 {userNotFound && (
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => router.push("/sign-up")}
//                   >
//                     Create Account
//                   </Button>
//                 )}
//               </AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="space-y-1">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 {...register("email")}
//                 disabled={loading}
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-1">
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 {...register("password")}
//                 disabled={loading}
//               />
//               {errors.password && (
//                 <p className="text-sm text-destructive">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <Button className="w-full" disabled={loading}>
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }