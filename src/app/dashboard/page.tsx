"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const res = await fetch(`/api/getUserProfile?uid=${currentUser.uid}`);
          const data = await res.json();
          console.log("API response:", data);
          setUser(data.user);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      } else {
        // If user is not logged in, redirect to sign-in page
        router.push("/sign-in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to sign-in page after logout
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Try again.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg font-medium">
        Loading profile...
      </p>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium">No profile found.</p>
        <Button className="mt-4" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user.name || "No Name"}
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            <strong>Email:</strong> {user.email || "No Email"}
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            <strong>Role:</strong> {user.role || "No Role"}
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            <strong>UID:</strong> {user.uid}
          </p>

          <Button
            variant="destructive"
            className="mt-4 w-full md:w-1/2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
