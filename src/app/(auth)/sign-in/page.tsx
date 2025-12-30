"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

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

// Schema (ONLY email + password)
const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
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
      await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Sign In
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Message */}
          {errorMsg && (
            <Alert variant="destructive">
              <AlertDescription className="space-y-3">
                <p>{errorMsg}</p>

                {/* Show Create Account if user not found */}
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

























// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { auth, db } from "@/lib/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// // shadcn ui
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";

// // Zod schema
// const signUpSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type FormData = z.infer<typeof signUpSchema>;

// export default function SignUpPage() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(signUpSchema),
//   });

//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Email/Password Signup
//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const res = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       await setDoc(doc(db, "users", res.user.uid), {
//         uid: res.user.uid,
//         name: data.name,
//         email: data.email,
//         avatarUrl: "",
//         role: "user",
//         createdAt: new Date(),
//       });

//       toast.success("Account created successfully");
//       reset();
//       router.push("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google Signup
//   const handleGoogleSignUp = async () => {
//     setLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       await setDoc(
//         doc(db, "users", user.uid),
//         {
//           uid: user.uid,
//           name: user.displayName,
//           email: user.email,
//           avatarUrl: user.photoURL,
//           role: "user",
//           createdAt: new Date(),
//         },
//         { merge: true }
//       );

//       toast.success("Signed in with Google");
//       router.push("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted px-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl">
//             Create Account
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Name */}
//             <div className="space-y-1">
//               <Label>Name</Label>
//               <Input
//                 placeholder="John Doe"
//                 {...register("name")}
//                 disabled={loading}
//               />
//               {errors.name && (
//                 <p className="text-sm text-destructive">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="space-y-1">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 placeholder="you@example.com"
//                 {...register("email")}
//                 disabled={loading}
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="space-y-1">
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 placeholder="••••••••"
//                 {...register("password")}
//                 disabled={loading}
//               />
//               {errors.password && (
//                 <p className="text-sm text-destructive">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading}
//             >
//               {loading ? "Creating account..." : "Sign Up"}
//             </Button>
//           </form>

//           <Separator />

//           <Button
//             variant="outline"
//             className="w-full"
//             onClick={handleGoogleSignUp}
//             disabled={loading}
//           >
//             Continue with Google
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


































// "use client"; // Required for client-side hooks and Firebase auth

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth, db } from "@/lib/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useState } from "react";
// import { toast } from "sonner"; // for toast notifications
// import { useRouter } from "next/navigation"; // for redirect

// // Zod schema for form validation
// const signUpSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// // Infer TypeScript type from schema
// type FormData = z.infer<typeof signUpSchema>;

// export default function SignUpPage() {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
//     resolver: zodResolver(signUpSchema),
//   });

//   const [loading, setLoading] = useState(false);
//   const router = useRouter(); // Initialize router

//   // Regular Email/Password Sign-Up
//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

//       // Save user profile to Firestore
//       await setDoc(doc(db, "users", res.user.uid), {
//         uid: res.user.uid,
//         name: data.name,
//         bio: "",
//         avatarUrl: "",
//         role: "user",
//         preferences: { theme: "light" },
//         createdAt: new Date(),
//       });

//       toast.success("Sign-Up Successful! Redirecting...");
      
//       reset();

//       // Redirect to dashboard after short delay
//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 1000);

//     } catch (err: any) {
//       if (err.code === "auth/email-already-in-use") {
//         toast.error("This email is already registered. Please sign in instead.");
//       } else {
//         toast.error(err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google Sign-Up / Sign-In
//   const handleGoogleSignUp = async () => {
//     setLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // Check if Firestore document exists, if not create
//       const userDoc = doc(db, "users", user.uid);
//       await setDoc(userDoc, {
//         uid: user.uid,
//         name: user.displayName || "Google User",
//         bio: "",
//         avatarUrl: user.photoURL || "",
//         role: "user",
//         preferences: { theme: "light" },
//         createdAt: new Date(),
//       }, { merge: true }); // merge true = don’t overwrite if exists

//       toast.success("Signed in with Google! Redirecting...");

//       // Redirect to dashboard after short delay
//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 1000);

//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow-md bg-white">
//       <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
//         <div>
//           <input
//             {...register("name")}
//             placeholder="Name"
//             className="border p-2 rounded w-full"
//             disabled={loading}
//           />
//           {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//         </div>

//         <div>
//           <input
//             {...register("email")}
//             placeholder="Email"
//             className="border p-2 rounded w-full"
//             disabled={loading}
//           />
//           {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//         </div>

//         <div>
//           <input
//             {...register("password")}
//             type="password"
//             placeholder="Password"
//             className="border p-2 rounded w-full"
//             disabled={loading}
//           />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//         </div>

//         <button
//           type="submit"
//           className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Signing Up..." : "Sign Up"}
//         </button>
//       </form>

//       <div className="text-center my-4">or</div>

//       <button
//         onClick={handleGoogleSignUp}
//         className={`bg-red-500 text-white p-2 rounded w-full hover:bg-red-600 transition ${
//           loading ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Continue with Google"}
//       </button>
//     </div>
//   );
// }















// "use client";

// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { createSession } from "@/actions/auth.actions";
// import { useRouter } from "next/navigation";

// export default function SignInPage() {
//   const router = useRouter();

//   const login = async () => {
//     const res = await signInWithEmailAndPassword(
//       auth,
//       "testuser@gmail.com",
//       "123456"
//     );

//     const token = await res.user.getIdToken();
//     await createSession(token);

//     router.push("/dashboard");
//   };

//   return <button onClick={login}>Login</button>;
// }















// // "use client"; // Required for client-side hooks and Firebase auth

// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// // import { auth, db } from "@/lib/firebase";
// // import { doc, setDoc } from "firebase/firestore";
// // import { useState } from "react";
// // import { toast } from "sonner"; // for toast notifications

// // // Zod schema for form validation
// // const signUpSchema = z.object({
// //   name: z.string().min(2, "Name must be at least 2 characters"),
// //   email: z.string().email("Invalid email address"),
// //   password: z.string().min(6, "Password must be at least 6 characters"),
// // });

// // // Infer TypeScript type from schema
// // type FormData = z.infer<typeof signUpSchema>;

// // export default function SignUpPage() {
// //   const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
// //     resolver: zodResolver(signUpSchema),
// //   });

// //   const [loading, setLoading] = useState(false);

// //   // Regular Email/Password Sign-Up
// //   const onSubmit = async (data: FormData) => {
// //     setLoading(true);
// //     try {
// //       const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

// //       // Save user profile to Firestore
// //       await setDoc(doc(db, "users", res.user.uid), {
// //         uid: res.user.uid,
// //         name: data.name,
// //         bio: "",
// //         avatarUrl: "",
// //         role: "user",
// //         preferences: { theme: "light" },
// //         createdAt: new Date(),
// //       });

// //       toast.success("Sign-Up Successful! You can now sign in.");
// //       reset();
// //     } catch (err: any) {
// //       if (err.code === "auth/email-already-in-use") {
// //         toast.error("This email is already registered. Please sign in instead.");
// //       } else {
// //         toast.error(err.message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Google Sign-Up / Sign-In
// //   const handleGoogleSignUp = async () => {
// //     setLoading(true);
// //     try {
// //       const provider = new GoogleAuthProvider();
// //       const result = await signInWithPopup(auth, provider);
// //       const user = result.user;

// //       // Check if Firestore document exists, if not create
// //       const userDoc = doc(db, "users", user.uid);
// //       await setDoc(userDoc, {
// //         uid: user.uid,
// //         name: user.displayName || "Google User",
// //         bio: "",
// //         avatarUrl: user.photoURL || "",
// //         role: "user",
// //         preferences: { theme: "light" },
// //         createdAt: new Date(),
// //       }, { merge: true }); // merge true = don’t overwrite if exists

// //       toast.success("Signed in with Google!");
// //     } catch (err: any) {
// //       toast.error(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow-md bg-white">
// //       <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>

// //       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
// //         <div>
// //           <input
// //             {...register("name")}
// //             placeholder="Name"
// //             className="border p-2 rounded w-full"
// //             disabled={loading}
// //           />
// //           {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
// //         </div>

// //         <div>
// //           <input
// //             {...register("email")}
// //             placeholder="Email"
// //             className="border p-2 rounded w-full"
// //             disabled={loading}
// //           />
// //           {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
// //         </div>

// //         <div>
// //           <input
// //             {...register("password")}
// //             type="password"
// //             placeholder="Password"
// //             className="border p-2 rounded w-full"
// //             disabled={loading}
// //           />
// //           {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
// //         </div>

// //         <button
// //           type="submit"
// //           className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
// //             loading ? "opacity-50 cursor-not-allowed" : ""
// //           }`}
// //           disabled={loading}
// //         >
// //           {loading ? "Signing Up..." : "Sign Up"}
// //         </button>
// //       </form>

// //       <div className="text-center my-4">or</div>

// //       <button
// //         onClick={handleGoogleSignUp}
// //         className={`bg-red-500 text-white p-2 rounded w-full hover:bg-red-600 transition ${
// //           loading ? "opacity-50 cursor-not-allowed" : ""
// //         }`}
// //         disabled={loading}
// //       >
// //         {loading ? "Processing..." : "Continue with Google"}
// //       </button>
// //     </div>
// //   );
// // }
