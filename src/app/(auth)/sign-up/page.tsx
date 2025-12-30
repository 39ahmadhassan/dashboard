"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schema
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

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

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: data.name,
        bio: "",
        avatarUrl: "",
        role: "user",
        preferences: { theme: "light" },
        createdAt: new Date(),
      });

      // 🔑 Prevent auto-login
      await signOut(auth);

      setSuccess(true);

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
          <CardTitle className="text-center text-xl">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ✅ Success Message */}
          {success && (
            <Alert className="border-green-500 text-green-700">
              <AlertDescription>
                Account created successfully! Redirecting to sign in…
              </AlertDescription>
            </Alert>
          )}

          {/* ❌ Email Already Exists */}
          {emailExists && (
            <Alert variant="destructive">
              <AlertDescription className="space-y-3">
                <p>
                  This email is already registered.
                  Please sign in instead.
                </p>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/sign-in")}
                >
                  Go to Sign In
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                {...register("name")}
                placeholder="John Doe"
                disabled={loading || success || emailExists}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                disabled={loading || success || emailExists}
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
                {...register("password")}
                type="password"
                placeholder="••••••••"
                disabled={loading || success || emailExists}
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
              disabled={loading || success || emailExists}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
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
// import {
//   createUserWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { auth, db } from "@/lib/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";

// // shadcn ui
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// // Schema
// const signUpSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type SignUpFormData = z.infer<typeof signUpSchema>;

// export default function Page() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignUpFormData>({
//     resolver: zodResolver(signUpSchema),
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const onSubmit = async (data: SignUpFormData) => {
//     if (loading) return;
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
//         bio: "",
//         avatarUrl: "",
//         role: "user",
//         preferences: { theme: "light" },
//         createdAt: new Date(),
//       });

//       // 🔑 Firebase auto-login fix
//       await signOut(auth);

//       setSuccess(true);

//       setTimeout(() => {
//         router.replace("/sign-in");
//       }, 1500);

//     } catch (err: any) {
//       alert(err.message || "Something went wrong");
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
//                 Account created successfully! Redirecting to sign in…
//               </AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Name */}
//             <div className="space-y-1">
//               <Label>Name</Label>
//               <Input
//                 {...register("name")}
//                 placeholder="John Doe"
//                 disabled={loading || success}
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
//                 {...register("email")}
//                 type="email"
//                 placeholder="you@example.com"
//                 disabled={loading || success}
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
//                 {...register("password")}
//                 type="password"
//                 placeholder="••••••••"
//                 disabled={loading || success}
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
//               disabled={loading || success}
//             >
//               {loading ? "Creating account..." : "Sign Up"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




























// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   createUserWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { auth, db } from "@/lib/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";

// // Schema
// const signUpSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type SignUpFormData = z.infer<typeof signUpSchema>;

// export default function Page() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignUpFormData>({
//     resolver: zodResolver(signUpSchema),
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const onSubmit = async (data: SignUpFormData) => {
//     if (loading) return;
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
//         bio: "",
//         avatarUrl: "",
//         role: "user",
//         preferences: { theme: "light" },
//         createdAt: new Date(),
//       });

//       // 🔑 Firebase auto-login fix
//       await signOut(auth);

//       // ✅ Show success message
//       setSuccess(true);

//       // ✅ Redirect AFTER message
//       setTimeout(() => {
//         router.replace("/sign-in");
//       }, 1500);

//     } catch (err: any) {
//       alert(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
//       >
//         <h1 className="text-xl font-bold text-center">Sign Up</h1>

//         {success && (
//           <div className="bg-green-100 text-green-700 p-2 rounded text-sm text-center">
//             Account created successfully! Redirecting to sign in...
//           </div>
//         )}

//         <div>
//           <input
//             {...register("name")}
//             placeholder="Name"
//             className="border p-2 w-full rounded"
//             disabled={loading || success}
//           />
//           {errors.name && (
//             <p className="text-red-500 text-sm">{errors.name.message}</p>
//           )}
//         </div>

//         <div>
//           <input
//             {...register("email")}
//             placeholder="Email"
//             className="border p-2 w-full rounded"
//             disabled={loading || success}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <input
//             {...register("password")}
//             type="password"
//             placeholder="Password"
//             className="border p-2 w-full rounded"
//             disabled={loading || success}
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading || success}
//           className={`w-full p-2 rounded text-white transition ${
//             loading || success
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Creating account..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// }

















// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "@/lib/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// // ✅ Zod schema for validation
// const signUpSchema = z.object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type SignUpFormData = z.infer<typeof signUpSchema>;

// export default function SignUpPage() {
//     const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
//         resolver: zodResolver(signUpSchema),
//     });
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();
//     const onSubmit = async (data: SignUpFormData) => {
//         setLoading(true);
//         try {
//             const res = await createUserWithEmailAndPassword(
//                 auth,
//                 data.email,
//                 data.password
//             );

//             await setDoc(doc(db, "users", res.user.uid), {
//                 uid: res.user.uid,
//                 name: data.name,
//                 bio: "",
//                 avatarUrl: "",
//                 role: "user",
//                 preferences: { theme: "light" },
//                 createdAt: new Date(),
//             });

//             alert("Sign-Up Success! Please sign in.");

//             // ✅ Redirect to Sign-In page
//             router.push("/sign-in");

//         } catch (err: any) {
//             if (err.code === "auth/email-already-in-use") {
//                 alert("This email is already registered. Please sign in.");
//             } else {
//                 alert(err.message);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // const onSubmit = async (data: SignUpFormData) => {
//     //     setLoading(true);
//     //     try {
//     //         // Create user in Firebase Auth
//     //         const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

//     //         // Create user profile in Firestore
//     //         await setDoc(doc(db, "users", res.user.uid), {
//     //             uid: res.user.uid,
//     //             name: data.name,
//     //             bio: "",
//     //             avatarUrl: "",
//     //             role: "user",
//     //             preferences: { theme: "light" },
//     //             createdAt: new Date(),
//     //         });

//     //         alert("Sign-Up Success!");
//     //         router.push("/dashboard"); // Redirect to dashboard
//     //     } catch (err: any) {
//     //         if (err.code === "auth/email-already-in-use") {
//     //             alert("This email is already registered. Please use a different email or sign in.");
//     //         } else {
//     //             alert(err.message);
//     //         }
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-50">
//             <form
//                 onSubmit={handleSubmit(onSubmit)}
//                 className="bg-white p-6 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
//             >
//                 <h2 className="text-xl font-bold text-center">Sign Up</h2>

//                 <div className="flex flex-col">
//                     <input
//                         {...register("name")}
//                         placeholder="Name"
//                         className="border p-2 rounded"
//                         disabled={loading}
//                     />
//                     {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
//                 </div>

//                 <div className="flex flex-col">
//                     <input
//                         {...register("email")}
//                         placeholder="Email"
//                         className="border p-2 rounded"
//                         disabled={loading}
//                     />
//                     {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
//                 </div>

//                 <div className="flex flex-col">
//                     <input
//                         {...register("password")}
//                         type="password"
//                         placeholder="Password"
//                         className="border p-2 rounded"
//                         disabled={loading}
//                     />
//                     {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
//                 </div>

//                 <button
//                     type="submit"
//                     className={`bg-blue-500 text-white p-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                     disabled={loading}
//                 >
//                     {loading ? "Signing Up..." : "Sign Up"}
//                 </button>
//             </form>
//         </div>
//     );
// }
